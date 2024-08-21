// src/production_layout/production_list/ProductionList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEditProductionForm from '../../productionModal/AddEditProductionForm';
import './ProductionList.css';

const API_URL_PRODUCTIONS = 'https://vianny-bakery-app.onrender.com/api/productions/';
const API_URL_INVENTORY = 'https://vianny-bakery-app.onrender.com/api/inventory/';

const ProductionList = ({ loggedInUsername }) => {
  const [productions, setProductions] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingProduction, setEditingProduction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchProductions = async () => {
    try {
      const response = await axios.get(`${API_URL_PRODUCTIONS}?username=${loggedInUsername}`);
      console.log('Fetched productions:', response.data);

      const sortedProductions = response.data.sort((a, b) => new Date(b.productionDate) - new Date(a.productionDate));

      setProductions(sortedProductions);
    } catch (error) {
      console.error('Error fetching productions:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(API_URL_INVENTORY);
      console.log('Fetched inventory items:', response.data);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  useEffect(() => {
    fetchProductions();
    fetchInventoryItems();
  }, []);

  const handleAddClick = () => {
    setEditingProduction(null);
    setShowForm(true);
  };

  const handleEditClick = (production) => {
    setEditingProduction(production);
    setShowForm(true);
  };

  const handleSave = async (production) => {
    try {
      if (production.quantityUsed && !Array.isArray(production.quantityUsed)) {
        production.quantityUsed = [production.quantityUsed];
      } else if (!production.quantityUsed) {
        production.quantityUsed = [];
      }

      if (production.id) {
        await axios.put(`${API_URL_PRODUCTIONS}${production.id}/`, production);
      } else {
        await axios.post(API_URL_PRODUCTIONS, production);
      }

      fetchProductions();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving production record:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDelete = async (productionID) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_URL_PRODUCTIONS}${productionID}/`);
        fetchProductions();
      } catch (error) {
        console.error('Error deleting production record:', error);
      }
    }
  };

  const handleViewClick = (record) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const getRawMaterialDetails = (rawMaterials) => {
    return rawMaterials.map(materialId => {
      const item = inventoryItems.find(i => i.id === materialId);
      return item ? item.name : 'Unknown';
    });
  };

  const formatUnitPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      return `shs ${numericPrice.toFixed(2)}`;
    }
    return 'N/A';
  };

  const Popup = ({ record, onClose }) => {
    if (!record) return null;

    const unitPrice = parseFloat(record.unit_price) || 0;
    const quantityProduced = parseFloat(record.quantityProduced) || 0;
    const quantityDamaged = parseFloat(record.quantityDamaged) || 0;

    const totalCost = quantityProduced * unitPrice;
    const netCost = totalCost - (quantityDamaged * unitPrice);

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>Product Details</h3>
          <p><strong>Product Name:</strong> {record.productName}</p>
          <p><strong>Total Cost:</strong> shs {totalCost.toFixed(2)}</p>
          <p><strong>Net Cost:</strong> shs {netCost.toFixed(2)}</p> {/* Added Net Cost */}
          <p><strong>Production Date:</strong> {new Date(record.productionDate).toLocaleString()}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="production-list-container">
      <h2>Production List</h2>
      <button className="add-production-button" onClick={handleAddClick}>
        Add New Production Record
      </button>
      {showForm && (
        <AddEditProductionForm
          production={editingProduction}
          onSave={handleSave}
          onCancel={handleCancel}
          loggedInUsername={loggedInUsername}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Raw Materials</th>
            <th>Qty Used(Kgs|Pcs|Ltrs)</th>
            <th>Qty Produced(Pcs)</th>
            <th>Qty Damaged</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productions.map(record => (
            <tr key={record.id}>
              <td>{record.productName}</td>
              <td>
                <ul className="vertical-list">
                  {getRawMaterialDetails(record.rawMaterials).map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="vertical-list">
                  {record.quantityUsed.map((quantity, index) => (
                    <li key={index}>{quantity}</li>
                  ))}
                </ul>
              </td>
              <td>{record.quantityProduced ? record.quantityProduced : 'N/A'}</td>
              <td>{record.quantityDamaged ? record.quantityDamaged : 'N/A'}</td>
              <td>{formatUnitPrice(record.unit_price)}</td>
              <td>
                <button onClick={() => handleViewClick(record)} disabled={!record.quantityProduced || !record.unit_price}>
                  View
                </button>
                <button onClick={() => handleEditClick(record)} disabled={record.quantityProduced && record.unit_price}>
                  Edit
                </button>
                {/*<button onClick={() => handleDelete(record.id)}>Delete</button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && <Popup record={selectedRecord} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ProductionList;
