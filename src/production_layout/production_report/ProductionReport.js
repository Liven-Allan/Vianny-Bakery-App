/* src/production_layout/production_report/ProductionReport.js */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ProductionReport.css';

// Function to format date and time
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
};

const ProductionReport = () => {
  const [productionDetails, setProductionDetails] = useState([]);
  const [formattedRawMaterialDetails, setFormattedRawMaterialDetails] = useState([]);
  const [dates, setDates] = useState([]);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch production data
        const productionResponse = await axios.get('http://localhost:8000/api/productions/');
        const productionData = productionResponse.data;

        // Fetch inventory data
        const inventoryResponse = await axios.get('http://localhost:8000/api/inventory/');
        const inventoryData = inventoryResponse.data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        // Process production data
        const productionDates = [...new Set(productionData.map(item => formatDateTime(item.productionDate)))];
        
        // Sort dates in descending order
        productionDates.sort((a, b) => new Date(b) - new Date(a));
        setDates(productionDates);

        // Set product names for date
        const productNamesMap = productionData.reduce((acc, item) => {
          const formattedDate = formatDateTime(item.productionDate);
          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          if (!acc[formattedDate].includes(item.productName)) {
            acc[formattedDate].push(item.productName);
          }
          return acc;
        }, {});
        setProductNames(productNamesMap);

        const formattedProductionDetails = productionData.map(item => {
          const { productName, quantityProduced, productionDate, unit_price, quantityDamaged } = item;

          const unitPrice = parseFloat(unit_price) || 0;
          const damagedQuantity = quantityDamaged || 0;

          // Calculate total cost
          const totalCost = (quantityProduced * unitPrice).toFixed(2);

          // Calculate net price
          const netPrice = (quantityProduced * unitPrice) - (damagedQuantity * unitPrice);

          return {
            date: formatDateTime(productionDate),
            productName,
            quantityProduced,
            quantityDamaged: damagedQuantity, // Ensure quantityDamaged is included
            unitPrice: unit_price,
            totalCost: totalCost,
            netPrice: netPrice.toFixed(2) // Calculate net price
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        const rawMaterialDetails = productionData.flatMap(item => {
          const { productName, rawMaterials, quantityUsed, productionDate } = item;

          return rawMaterials.map((materialId, index) => ({
            productName,
            rawMaterialName: inventoryData[materialId]?.name || 'Unknown',
            quantity: quantityUsed[index],
            unitPrice: inventoryData[materialId]?.unit_price || '0.00',
            totalCost: (quantityUsed[index] * (parseFloat(inventoryData[materialId]?.unit_price) || 0)).toFixed(2),
            date: formatDateTime(productionDate)
          }));
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        const formattedDetails = rawMaterialDetails.reduce((acc, item) => {
          if (!acc[item.productName]) {
            acc[item.productName] = { rawMaterials: [] };
          }
          acc[item.productName].rawMaterials.push(item);
          return acc;
        }, {});

        setProductionDetails(formattedProductionDetails);
        setFormattedRawMaterialDetails(formattedDetails);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const generatePDF = (date) => {
    const filteredProductionDetails = productionDetails.filter(item => item.date === date);
    const filteredRawMaterialDetails = Object.fromEntries(
      Object.entries(formattedRawMaterialDetails).filter(([key]) =>
        filteredProductionDetails.some(detail => detail.productName === key)
      )
    );

    const doc = new jsPDF();
  
    // Production Details Table Data
    const productionTableData = filteredProductionDetails.map(item => [
      formatDateTime(item.date),
      item.productName,
      item.quantityProduced,
      item.quantityDamaged, // Include quantityDamaged
      `shs: ${item.unitPrice}`,
      `shs: ${item.netPrice}`, // Include netPrice
      `shs: ${item.totalCost}`
    ]);
  
    // Raw Material Details Table Data
    const rawMaterialTableData = [];
    Object.entries(filteredRawMaterialDetails).forEach(([productName, details]) => {
      details.rawMaterials.forEach((material, index) => {
        rawMaterialTableData.push([
          index === 0 ? productName : '',
          material.rawMaterialName,
          material.quantity,
          `shs: ${material.unitPrice}`,
          `shs: ${material.totalCost}`
        ]);
      });
    });
  
    // Product Details Table
    doc.text('Production Report', 14, 16);
    doc.text(`Date: ${formatDateTime(new Date())}`, 14, 24);
  
    doc.autoTable({
      startY: 32,
      head: [['Date and Time', 'Product Name', 'Quantity Produced (Pcs)', 'Qty Damaged', 'Unit Price', 'Net Price', 'Total Cost']],
      body: productionTableData,
      margin: { top: 32 },
    });
  
    const totalProductCost = productionTableData.reduce((sum, row) => sum + parseFloat(row[6].replace('shs: ', '')), 0).toFixed(2);
    const totalNetCost = productionTableData.reduce((sum, row) => sum + parseFloat(row[5].replace('shs: ', '')), 0).toFixed(2);
    
    doc.text(`Overall Product Cost: shs: ${totalProductCost}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Overall Product Net Cost: shs: ${totalNetCost}`, 14, doc.lastAutoTable.finalY + 20);
  
    // Raw Material Details Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Product Name', 'Raw Material Name', 'Quantity (Kgs|Pcs|Ltrs)', 'Unit Price', 'Total Cost']],
      body: rawMaterialTableData,
    });
  
    const totalRawMaterialCost = rawMaterialTableData.reduce((sum, row) => sum + parseFloat(row[4].replace('shs: ', '')), 0).toFixed(2);
    doc.text(`Overall Raw Material Cost: shs: ${totalRawMaterialCost}`, 14, doc.lastAutoTable.finalY + 10);
  
    doc.save(`production_report_${date.replace(/[/,: ]+/g, '_')}.pdf`);
  };

  return (
    <div className="production-report-container">
      <h2>Production Report</h2>
      <table className="date-button-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product Names</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date}>
              <td>{date}</td>
              <td>{productNames[date]?.join(', ') || 'No Product'}</td>
              <td>
                <button 
                  className="export-button" 
                  onClick={() => generatePDF(date)}
                >
                  Generate PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionReport;
