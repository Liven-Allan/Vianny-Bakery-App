// src/sales_layout/sales_list/AddEditStock.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEditStock.css';

const AddEditStock = ({ stock, onSave, onCancel }) => {
  const [product, setProduct] = useState({
    id: stock?.product_id || '',
    quantity: stock?.quantity_obtained || 0,
    amount: stock?.stock_amount || 0,
  });

  const [additionalQuantity, setAdditionalQuantity] = useState(0);

  useEffect(() => {
    if (stock) {
      setProduct({
        id: stock.product_id || '',
        quantity: stock.quantity_obtained || 0,
        amount: stock.stock_amount || 0,
      });
      setAdditionalQuantity(stock.additional_quantity || 0); // Set the additional quantity if editing
    }
  }, [stock]);

  // Handle changes to product fields
  const handleChange = (field, value) => {
    if (field === 'additionalQuantity') {
      setAdditionalQuantity(value);
    } else {
      setProduct(prevProduct => ({
        ...prevProduct,
        [field]: value,
      }));
    }
  };

  // Handle saving the data
  const handleSave = () => {
    const updatedQuantity = product.quantity + additionalQuantity;

    const stockData = {
      id: stock ? stock.id : null,
      product_id: product.id,
      quantity_obtained: updatedQuantity,
      stock_amount: product.amount,
      additional_quantity: additionalQuantity, // Include additional quantity in stockData
    };

    const requestMethod = stock ? axios.put : axios.post;
    const url = stock ? `http://localhost:8000/api/salestocks/${stock.id}/` : 'http://localhost:8000/api/salestocks/';

    requestMethod(url, stockData)
      .then(response => {
        onSave(response.data);
      })
      .catch(error => {
        console.error('Error saving stock record:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <h2>{stock ? 'Edit Stock Record' : 'Add New Stock Record'}</h2>
        <div className="product-entry">
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              value={product.id}
              readOnly={!!stock} // Read-only if editing
              placeholder="Product Name"
              onChange={(e) => {
                if (!stock) { // Allow changes if in add mode
                  handleChange('id', e.target.value);
                }
              }}
            />
          </div>
          <div className="form-group">
            <label>Quantities Obtained:</label>
            <input
              type="number"
              value={product.quantity}
              readOnly={!!stock} // Read-only if editing
              placeholder="Quantities Obtained"
              onChange={(e) => {
                if (!stock) { // Allow changes if in add mode
                  handleChange('quantity', parseInt(e.target.value, 10) || 0);
                }
              }}
            />
          </div>
          {stock && (
            <div className="form-group">
              <label>Additional Quantity:</label>
              <input
                type="number"
                value={additionalQuantity}
                onChange={(e) => handleChange('additionalQuantity', parseInt(e.target.value, 10) || 0)}
                placeholder="Additional Quantity"
              />
            </div>
          )}
          <div className="form-group">
            <label>Unit Price:</label>
            <input
              type="number"
              step="0.01"
              value={product.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="Unit Price"
            />
          </div>
        </div>
        <div className="form-buttons">
          <button onClick={handleSave}>{stock ? 'Update' : 'Save'}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddEditStock;
