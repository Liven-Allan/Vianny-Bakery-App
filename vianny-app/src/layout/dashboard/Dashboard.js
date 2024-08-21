/* src/layout/dashboard/Dashboard.js */

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [totalCosts, setTotalCosts] = useState([]);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions data
        const transactionsResponse = await axios.get('https://vianny-bakery-app.onrender.com/api/transactions/');
        const transactionsData = transactionsResponse.data;

        // Fetch inventory data
        const inventoryResponse = await axios.get('https://vianny-bakery-app.onrender.com/api/inventory/');
        const inventoryData = inventoryResponse.data;

        // Create a mapping of product IDs to product names
        const productNamesMap = {};
        inventoryData.forEach(item => {
          productNamesMap[item.id] = item.name;
        });
        setProductNames(productNamesMap);

        // Sort transactions by transaction_date in descending order
        transactionsData.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

        // Aggregate data by date and calculate total quantity and associate the username
        const aggregatedData = {};
        transactionsData.forEach(item => {
          const { transaction_date, product, quantity, unit_price, username } = item;
          const date = transaction_date.split('T')[0]; // Extract date part

          if (!aggregatedData[date]) {
            aggregatedData[date] = {
              products: {},
              total_cost: 0,
              recorded_by: username,
            };
          }
          if (!aggregatedData[date].products[product]) {
            aggregatedData[date].products[product] = { quantity: 0, recorded_by: username };
          }
          aggregatedData[date].products[product].quantity += quantity;
          aggregatedData[date].total_cost += quantity * parseFloat(unit_price);
        });

        // Convert aggregated data to array format for the line chart
        const formattedData = Object.entries(aggregatedData).map(([date, values]) => ({
          date,
          total_quantity: Object.values(values.products).reduce((a, b) => a + b.quantity, 0),
        }));
        setData(formattedData);

        // Convert aggregated data to array format for the stock levels table
        const formattedStockLevels = Object.entries(aggregatedData).map(([date, values]) => ({
          date,
          products: Object.entries(values.products).map(([productId, productData]) => ({
            product: productNames[productId] || 'Unknown Product',
            quantity: productData.quantity,
            recorded_by: productData.recorded_by,
          })),
        }));

        console.log('Formatted Stock Levels:', formattedStockLevels);  // Log to verify the structure
        setStockLevels(formattedStockLevels);

        // Convert aggregated data to array format for the total cost view
        const formattedTotalCosts = Object.entries(aggregatedData).map(([date, values]) => ({
          date,
          total_cost: values.total_cost.toFixed(2),  // Format as a fixed-point number
        }));
        setTotalCosts(formattedTotalCosts);

      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, [productNames]); // Include productNames in dependency array

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
      <h2>Dashboard</h2>
      <div className="chart-container">
        <h2>Inventory Trends Over Time</h2>
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

      <div className="stock-levels-container">
        <h2>Stock Levels</h2>
        <table className="stock-levels-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity (Kgs|Pcs|Ltr)</th>
              <th>Recorded By</th>
            </tr>
          </thead>
          <tbody>
            {stockLevels.flatMap((item, index) =>
              item.products ? (
                item.products.map((product, idx) => (
                  <tr key={`${item.date}-${idx}`}>
                    <td>{idx === 0 ? item.date : ''}</td>
                    <td>{product.product}</td>
                    <td>{product.quantity}</td>
                    <td>{product.recorded_by}</td>
                  </tr>
                ))
              ) : (
                <tr key={index}>
                  <td colSpan="4">No products available</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="total-costs-container">
        <h2>Total Costs</h2>
        <table className="total-costs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {totalCosts.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>shs:{item.total_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
