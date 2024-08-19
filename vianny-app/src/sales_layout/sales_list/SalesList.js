// src/sales_layout/sales_list/SalesList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesList.css';
import AddEditSales from './AddEditSales';

const SalesList = ({ loggedInUsername }) => {
  const [sales, setSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/sales?username=${loggedInUsername}`);
        
        // Sort sales by sales_date in descending order
        const sortedSales = response.data.sort((a, b) => new Date(b.sales_date) - new Date(a.sales_date));
        
        setSales(sortedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, [refresh]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSale(null);
    setRefresh(prev => !prev);
  };


  const handleDelete = async (sale) => {
    try {
      const { branch_id, product_id, quantity_sold } = sale;
      
      // 1. Fetch the sale details
      const stockResponse = await axios.get(`http://localhost:8000/api/salestocks/?branch_id=${branch_id}`);
      const branchStock = stockResponse.data.find(stock => stock.product_id === product_id);
  
      if (branchStock) {
        // Increment the quantity_obtained by the quantity_sold
        const updatedQuantity = branchStock.quantity_obtained + quantity_sold;
  
        await axios.put(`http://localhost:8000/api/salestocks/${branchStock.id}/`, {
          ...branchStock,
          quantity_obtained: updatedQuantity
        });
      }
  
      // 2. Delete the sale record
      await axios.delete(`http://localhost:8000/api/sales/${sale.id}/`);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };
  
  

  const handleView = (sale) => {
    setCurrentSale(sale);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentSale(null);
  };

  return (
    <div>
      <h2>Sales List</h2>
      <div className="button-container">
        <button className="add-record-button" onClick={() => setShowModal(true)}>Add Sale Record</button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <AddEditSales sale={currentSale} onSave={handleCloseModal} onCancel={handleCloseModal} loggedInUsername={loggedInUsername}/>
          </div>
        </div>
      )}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-content view-modal-content">
            <button className="close-button" onClick={handleCloseViewModal}>X</button>
            <h3>Sale Details</h3>
            <table className="view-details-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{currentSale?.product_id}</td>
                  <td>{currentSale?.sales_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="table-container">
        <table className="sales-list-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Sales Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.product_id}</td>
                <td>{sale.quantity_sold}</td>
                <td>{sale.sales_amount}</td>
                <td>
                 
                  <button onClick={() => handleView(sale)}>View</button>
                  <button onClick={() => handleDelete(sale)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;
