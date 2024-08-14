/* src/production_layout/production_dashboard/ProductionDashboard.js */

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './ProductionDashboard.css';

// Function to format date and time
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
};

// Function to format raw materials vertically
const formatRawMaterials = (rawMaterials) => {
  const result = {};
  rawMaterials.forEach(({ productName, rawMaterialName, quantity, unitPrice, totalCost }) => {
    if (!result[productName]) {
      result[productName] = { rawMaterials: [] };
    }
    result[productName].rawMaterials.push({
      rawMaterialName,
      quantity,
      unitPrice,
      totalCost,
    });
  });
  return result;
};

const ProductionDashboard = () => {
  const [data, setData] = useState([]);
  const [productionDetails, setProductionDetails] = useState([]);
  const [formattedRawMaterialDetails, setFormattedRawMaterialDetails] = useState([]);

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

        // Aggregate production data by date
        const aggregatedData = productionData.reduce((acc, item) => {
          const { productionDate, quantityProduced } = item;
          const dateKey = formatDateTime(productionDate);

          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, total_quantity: 0 };
          }

          acc[dateKey].total_quantity += quantityProduced;

          return acc;
        }, {});

        // Convert aggregated data to array
        const chartData = Object.values(aggregatedData);

        // Format data for the production details table
        const formattedProductionDetails = productionData.map(item => {
          const { productName, quantityProduced, productionDate, unit_price, quantityDamaged } = item;

          const unitPrice = parseFloat(unit_price) || 0;
          const damagedQuantity = quantityDamaged || 0;

          // Calculate total cost
          const totalCost = (quantityProduced * unitPrice).toFixed(2);

          // Calculate net price
          const netPrice = (quantityProduced * unitPrice) - (damagedQuantity * unitPrice);

          return {
            date: new Date(productionDate).toLocaleString(), // Use locale string for date-time sorting
            productName,
            quantityProduced,
            unitPrice: unit_price,  // Unit price from production data
            quantityDamaged: damagedQuantity,  // Default to 0 if not present
            netPrice: netPrice.toFixed(2),  // Ensure it's a string with two decimals
            totalCost: totalCost,  // Already formatted
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        setProductionDetails(formattedProductionDetails);

        // Process data for the raw material details table
        const rawMaterialDetails = productionData.flatMap(item => {
          const { productName, quantityUsed, rawMaterials } = item;

          return rawMaterials.map((materialId, index) => ({
            productName,
            rawMaterialName: inventoryData[materialId]?.name || 'Unknown',
            quantity: quantityUsed[index],
            unitPrice: inventoryData[materialId]?.unit_price || '0.00',
            totalCost: (quantityUsed[index] * (parseFloat(inventoryData[materialId]?.unit_price) || 0)).toFixed(2),
            date: item.productionDate  // Add date to raw material details
          }));
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        // Format and group raw materials
        const formattedDetails = formatRawMaterials(rawMaterialDetails);
        setFormattedRawMaterialDetails(formattedDetails);
        setData(chartData); // Set aggregated data for chart

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Custom tooltip content for line chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, total_quantity } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${date}`}</p>
          <p>{`Total Quantity: ${total_quantity}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <h2>Production Dashboard</h2>
      <div className="chart-container">
        <h2>Production Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="total_quantity" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="production-details-container">
        <h2>Production Details</h2>
        <table className="production-details-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product Name</th>
              <th>Qty Produced (Pcs)</th>
              <th>Qty Damaged</th>
              <th>Unit Price</th>
              <th>Net Price</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {productionDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.productName}</td>
                <td>{item.quantityProduced}</td>
                <td>{item.quantityDamaged}</td>
                <td>shs: {item.unitPrice}</td>
                <td>shs: {item.netPrice}</td>
                <td>shs: {item.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="raw-material-details-container">
        <h2>Product - Raw Material Details</h2>
        <table className="raw-material-details-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Raw Material Name</th>
              <th>Qty (Kgs|Pcs|Ltrs)</th>
              <th>Unit Price</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(formattedRawMaterialDetails).map(([productName, details], index) => (
              details.rawMaterials.map((material, matIndex) => (
                <tr key={index + '-' + matIndex}>
                  {matIndex === 0 ? (
                    <td rowSpan={details.rawMaterials.length}>{productName}</td>
                  ) : null}
                  <td>{material.rawMaterialName}</td>
                  <td>{material.quantity}</td>
                  <td>shs: {material.unitPrice}</td>
                  <td>shs: {material.totalCost}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionDashboard;
