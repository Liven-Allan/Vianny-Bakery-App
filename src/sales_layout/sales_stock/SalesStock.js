// src/sales_layout/sales_stock/SalesStock.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesStock.css';
import AddEditStock from './AddEditStock';

const SalesStock = () => {
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state for view modal
  const [currentStock, setCurrentStock] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/salestocks/');
        // Sort stocks by stock_date in descending order
        const sortedStocks = response.data.sort((a, b) => new Date(b.stock_date) - new Date(a.stock_date));
        setStocks(sortedStocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, [refresh]);

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
      await axios.delete(`http://localhost:8000/api/salestocks/${id}/`);
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
            <AddEditStock stock={currentStock} onSave={handleCloseModal} onCancel={handleCloseModal} />
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
                {/* Check if product_id is an array or a single string */}
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
                  <button onClick={() => handleDelete(stock.id)}>Delete</button>
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
