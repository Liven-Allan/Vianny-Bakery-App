/* src/sales_layout/sales_report/SalesReport.js */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './SalesReport.css';

// Function to format date
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

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

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const salesResponse = await axios.get('https://vianny-bakery-app.onrender.com/api/sales/');
        const salesData = salesResponse.data;

        // Fetch stock transaction data
        const stockResponse = await axios.get('https://vianny-bakery-app.onrender.com/api/salesstocktransactions/');
        const stockData = stockResponse.data;

        // Extract unique dates from sales and stock data
        const salesDates = [...new Set(salesData.map(item => formatDate(item.sales_date)))];
        const stockDates = [...new Set(stockData.map(item => formatDate(item.stock_date)))];
        const allDates = [...new Set([...salesDates, ...stockDates])];
        
        // Sort dates in descending order
        allDates.sort((a, b) => new Date(b) - new Date(a));
        setDates(allDates);

        // Process sales data
        const formattedSalesDetails = salesData.map(item => ({
          date: formatDate(item.sales_date),
          dateTime: formatDateTime(item.sales_date),
          productName: item.product_id,
          quantitySold: item.quantity_sold,
          salesAmount: item.sales_amount
        })).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        // Process stock data
        const formattedStockDetails = stockData.map(item => ({
          date: formatDate(item.stock_date),
          dateTime: formatDateTime(item.stock_date),
          productName: item.product_id,
          quantityObtained: item.quantity_obtained,
          stockAmount: item.stock_amount,
          transactionType: item.transaction_type
        })).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        setSalesData(formattedSalesDetails);
        setStockData(formattedStockDetails);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const generateSalesPDF = (date) => {
    const filteredSalesDetails = salesData.filter(item => item.date === date);

    const doc = new jsPDF();

    // Sales Details Table Data
    const salesTableData = filteredSalesDetails.map(item => [
      item.dateTime,
      item.productName,
      item.quantitySold,
      `shs: ${item.salesAmount}`
    ]);

    // Sales Details Table
    doc.text('Sales Records', 14, 16);
    doc.text(`Date: ${formatDate(new Date())}`, 14, 24);

    doc.autoTable({
      startY: 32,
      head: [['Date and Time', 'Product ID', 'Quantity Sold', 'Sales Amount']],
      body: salesTableData,
      margin: { top: 32 },
    });

    const totalSalesAmount = salesTableData.reduce((sum, row) => sum + parseFloat(row[3].replace('shs: ', '')), 0).toFixed(2);
    doc.text(`Total Sales Amount: shs: ${totalSalesAmount}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`sales_report_${date.replace(/[/,: ]+/g, '_')}.pdf`);
  };

  const generateStockPDF = (date) => {
    const filteredStockDetails = stockData.filter(item => item.date === date);

    const doc = new jsPDF();

    // Stock Details Table Data
    const stockTableData = filteredStockDetails.map(item => {
      const totalCost = (item.quantityObtained * item.stockAmount).toFixed(2);
      return [
        item.dateTime,
        item.productName,
        item.quantityObtained,
        `shs: ${item.stockAmount}`,
        `shs: ${totalCost}`
      ];
    });

    // Stock Details Table
    doc.text('Stock Transactions', 14, 16);
    doc.text(`Date: ${formatDate(new Date())}`, 14, 24);

    doc.autoTable({
      startY: 32,
      head: [['Date and Time', 'Product ID', 'Quantity Obtained', 'Stock Amount', 'Total Cost']],
      body: stockTableData,
      margin: { top: 32 },
    });

    // Calculate the total stock amount
    const totalStockAmount = stockTableData.reduce((sum, row) => sum + parseFloat(row[4].replace('shs: ', '')), 0).toFixed(2);
    doc.text(`Total Stock Amount: shs: ${totalStockAmount}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`stock_report_${date.replace(/[/,: ]+/g, '_')}.pdf`);
  };

  return (
    <div className="sales-report-container">
      <h2>Sales Report</h2>
      <table className="date-button-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date}>
              <td>{date}</td>
              <td>
                <button 
                  className="export-button" 
                  onClick={() => generateSalesPDF(date)}
                >
                  Generate Sales PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>Stock Transactions</h2>
      <table className="date-button-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.map(date => (
            <tr key={date}>
              <td>{date}</td>
              <td>
                <button 
                  className="export-button" 
                  onClick={() => generateStockPDF(date)}
                >
                  Generate Stock PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
