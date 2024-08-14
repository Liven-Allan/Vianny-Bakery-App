// src/sales_layout/sales_dashboard/SalesDashboard.js

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './SalesDashboard.css';

// Function to format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date'; // Handle invalid dates
  }
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true // Change to false for 24-hour time
  });
};

// Function to format date only (for chart)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date'; // Handle invalid dates
  }
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
};

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const salesResponse = await axios.get('http://127.0.0.1:8000/api/sales/');
        const sales = salesResponse.data;
        
        // Log fetched sales data
        console.log('Fetched sales data:', sales);

        // Fetch transactions data
        const transactionResponse = await axios.get('http://127.0.0.1:8000/api/salesstocktransactions/');
        const transactions = transactionResponse.data;

        // Log fetched transactions data
        console.log('Fetched transactions data:', transactions);

        // Process data for sales trends chart
        const salesTrends = sales.reduce((acc, { sales_date, quantity_sold }) => {
          const dateKey = new Date(sales_date).toISOString().split('T')[0]; // Use ISO format for date
          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, sales_quantity: 0 };
          }
          acc[dateKey].sales_quantity += quantity_sold;
          return acc;
        }, {});

        // Convert sales data to array format for the chart
        const chartData = Object.values(salesTrends).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

        // Sort transactions data by date, latest first
        const sortedTransactions = transactions.sort((a, b) => new Date(b.stock_date) - new Date(a.stock_date));

        // Convert sales_amount from string to number and sort sales data by date, latest first
        const sortedSales = sales
          .map(item => ({
            ...item,
            sales_amount: parseFloat(item.sales_amount), // Convert sales_amount to number
            sales_date: formatDateTime(item.sales_date) // Format sales_date
          }))
          .sort((a, b) => new Date(b.sales_date) - new Date(a.sales_date));

        setSalesData(chartData); // Set sales data for the chart
        setTransactionData(sortedTransactions);
        setSalesRecords(sortedSales); // Set sales records for the table

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Custom tooltip content for line chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, sales_quantity } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${date}`}</p>
          <p>{`Sales Quantity: ${sales_quantity}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <h2>Sales Dashboard</h2>
      <div className="chart-container">
        <h2>Sales Trends Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="sales_quantity" stroke="#82ca9d" name="Sales Quantity" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="transaction-details-container">
        <h2>Stock Transactions</h2>
        <table className="transaction-details-table">
          <thead>
            <tr>
              <th>Date and Time</th>
              <th>Product Name</th>
              <th>Quantity (Pcs)</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item, index) => {
              // Calculate the total price
              const totalPrice = item.quantity_obtained * item.stock_amount;
              return (
                <tr key={index}>
                  <td>{formatDateTime(item.stock_date)}</td>
                  <td>{item.product_id}</td>
                  <td>{item.quantity_obtained}</td>
                  <td>shs: {item.stock_amount}</td>
                  <td>shs: {totalPrice.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sales-records-container">
        <h2>Sales Records</h2>
        <table className="sales-records-table">
          <thead>
            <tr>
              <th>Date and Time</th> {/* New header for date and time */}
              <th>Product ID</th>
              <th>Quantity Sold</th>
              <th>Sales Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesRecords.map((item, index) => (
              <tr key={index}>
                <td>{item.sales_date}</td> {/* New column for date and time */}
                <td>{item.product_id}</td>
                <td>{item.quantity_sold}</td>
                <td>shs: {item.sales_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
