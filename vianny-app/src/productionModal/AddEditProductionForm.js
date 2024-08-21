// src/production_layout/productionModal/AddEditProductionForm.js

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './AddEditProductionForm.css';

const AddEditProductionForm = ({ production, onSave, onCancel, loggedInUsername }) => {
  const [productName, setProductName] = useState(production ? production.productName : '');
  const [rawMaterials, setRawMaterials] = useState([]);
  const [quantityProduced, setQuantityProduced] = useState(production ? production.quantityProduced : '0');
  const [quantityDamaged, setQuantityDamaged] = useState(production ? production.quantityDamaged : '0'); // Added
  const [inventoryItems, setInventoryItems] = useState([]);
  const [unitPrice, setUnitPrice] = useState(production ? production.unit_price : '0'); // Ensure unitPrice is a string initially
  const isEditMode = !!production;

  useEffect(() => {
    axios.get('https://vianny-bakery-app.onrender.com/api/inventory/')
      .then(response => {
        const options = response.data.map(item => ({
          value: item.id,
          label: item.name
        }));
        setInventoryItems(options);
      })
      .catch(error => {
        console.error('Error fetching inventory items:', error);
      });
  }, []);

  useEffect(() => {
    if (production) {
      setProductName(production.productName);
      setQuantityProduced(production.quantityProduced || '0');
      setQuantityDamaged(production.quantityDamaged || '0'); // Set quantityDamaged
      setUnitPrice(production.unit_price || '0');

      const initialMaterials = production.rawMaterials.map(materialId => {
        const material = inventoryItems.find(item => item.value === materialId);
        return {
          value: materialId,
          label: material ? material.label : '',
          quantity: production.quantityUsed[production.rawMaterials.indexOf(materialId)] || '0'
        };
      });

      setRawMaterials(initialMaterials);
    }
  }, [production, inventoryItems]);

  const handleRawMaterialsChange = (selectedOptions) => {
    const updatedMaterials = selectedOptions ? selectedOptions.map(option => ({
      value: option.value,
      label: option.label,
      quantity: rawMaterials.find(material => material.value === option.value)?.quantity || '0'
    })) : [];
    setRawMaterials(updatedMaterials);
  };

  const handleQuantityChange = (index, value) => {
    if (!isEditMode) {
      const updatedMaterials = [...rawMaterials];
      updatedMaterials[index].quantity = value;
      setRawMaterials(updatedMaterials);
    }
  };

  const handleSave = () => {
    const rawMaterialIDs = rawMaterials.map(material => material.value);
    const quantitiesUsed = rawMaterials.map(material => material.quantity || '0');
  
    const productionData = {
      id: production ? production.id : null,
      productName,
      rawMaterials: rawMaterialIDs,
      quantityUsed: quantitiesUsed,
      quantityProduced: parseFloat(quantityProduced) || 0,
      quantityDamaged: parseFloat(quantityDamaged) || 0, // Include quantityDamaged
      unit_price: parseFloat(unitPrice) || 0, // Ensure unit_price is a number
      productionDate: production ? production.productionDate : new Date().toISOString().split('T')[0],
      username: loggedInUsername
    };
  
    const requestMethod = isEditMode ? axios.put : axios.post;
    const url = isEditMode ? `https://vianny-bakery-app.onrender.com/api/productions/${production.id}/` : 'https://vianny-bakery-app.onrender.com/api/productions/';
  
    requestMethod(url, productionData)
      .then(response => {
        onSave(response.data);
      })
      .catch(error => {
        console.error('Error saving production record:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <h2>{isEditMode ? 'Edit Production Record' : 'Add New Production Record'}</h2>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
            disabled={isEditMode}
          />
        </div>
        {!isEditMode && (
          <>
            <div className="form-group">
              <label>Raw Materials:</label>
              <Select
                isMulti
                options={inventoryItems}
                value={rawMaterials.map(material => ({
                  value: material.value,
                  label: material.label
                }))}
                onChange={handleRawMaterialsChange}
              />
              {rawMaterials.map((material, index) => (
                <div key={index} className="form-group">
                  <label>Quantity for {material.label}:</label>
                  <input
                    type="number"
                    value={material.quantity || '0'}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    placeholder="Enter Quantity"
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {isEditMode && (
          <>
            <div className="form-group">
              <label>Quantity Produced:</label>
              <input
                type="number"
                value={quantityProduced || '0'}
                onChange={(e) => setQuantityProduced(e.target.value)}
                placeholder="Enter Quantity Produced"
              />
            </div>
            <div className="form-group">
              <label>Quantity Damaged:</label> {/* Added */}
              <input
                type="number"
                value={quantityDamaged || '0'}
                onChange={(e) => setQuantityDamaged(e.target.value)}
                placeholder="Enter Quantity Damaged"
              />
            </div>
            <div className="form-group">
              <label>Unit Price:</label>
              <input
                type="number"
                value={unitPrice || '0'}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Enter Unit Price"
              />
            </div>
          </>
        )}
        <div className="form-buttons">
          <button onClick={handleSave}>{isEditMode ? 'Update' : 'Save'}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductionForm;

