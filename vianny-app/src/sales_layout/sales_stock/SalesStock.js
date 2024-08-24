// src/sales_layout/sales_stock/SalesStock.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesStock.css';
import AddEditStock from './AddEditStock';

const SalesStock = ({ loggedInUsername }) => {
  const [stocks, setStocks] = useState([]);
  const [allStocks, setAllStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state for view modal
  const [currentStock, setCurrentStock] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // Fetch all stocks
        const response = await axios.get('https://vianny-bakery-app.onrender.com/api/salestocks/');
        const stocksData = response.data;

        // Filter stocks based on the logged-in username
        const filteredStocks = stocksData.filter(stock => stock.username === loggedInUsername);

        // Set both all stocks and filtered stocks
        setAllStocks(stocksData);
        setStocks(filteredStocks);

        console.log('Data returned from backend:', filteredStocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, [refresh, loggedInUsername]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStock(null); // Reset currentStock
    setRefresh(prev => !prev);
  };

  const handleEdit = (stock) => {
    setCurrentStock(stock);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://vianny-bakery-app.onrender.com/api/salestocks/${id}/`);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleView = (stock) => {
    setCurrentStock(stock);
    setShowViewModal(true); // Show view modal
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentStock(null); // Reset currentStock
  };

  return (
    <div>
      <h2>Sales Stock</h2>
      <div className="button-container">
        <button className="add-record-button" onClick={() => setShowModal(true)}>Add Stock Record</button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <AddEditStock stock={currentStock} onSave={handleCloseModal} onCancel={handleCloseModal} loggedInUsername={loggedInUsername}/>
          </div>
        </div>
      )}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-content view-modal-content">
            <button className="close-button" onClick={handleCloseViewModal}>X</button>
            <h3>Product Details</h3>
            <table className="view-details-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Obtained</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(currentStock?.product_id) ? currentStock.product_id : [currentStock?.product_id]).map((product, index) => (
                  <tr key={index}>
                    <td>{product}</td>
                    <td>{currentStock.quantity_obtained}</td>
                    <td>{(currentStock.quantity_obtained * currentStock.stock_amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Qty Obtained</th>
              <th>Unit Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <td>{stock.product_id}</td>
                <td>{stock.quantity_obtained}</td>
                <td>{stock.stock_amount}</td>
                <td>
                  <button onClick={() => handleEdit(stock)}>Edit</button>
                  <button onClick={() => handleView(stock)}>View</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesStock;
