// src/modal/inventory_list_modal/InventoryModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import './InventoryModal.css';

Modal.setAppElement('#root');

const InventoryModal = ({ isOpen, onRequestClose, onSave, username }) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Raw Material');
  const [unitPrice, setUnitPrice] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');

  const handleSave = () => {
    const newItem = {
        name: productName,
        category,
        unit_price: parseFloat(unitPrice),
        reorder_level: parseInt(reorderLevel, 10),
        username,  // Add the logged-in username here
    };

    console.log('Saving new item with username:', username);  // Log the username and new item

    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    setProductName('');
    setCategory('Raw Material');
    setUnitPrice('');
    setReorderLevel('');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Add Inventory Item"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2>Add Inventory Item</h2>
      </div>
      <form>
        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Raw Material">Raw Material</option>
          </select>
        </label>
        <label>
          Unit Price:
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Quantity (Kgs|Pcs|Ltr):
          <input
            type="number"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
            required
          />
        </label>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" className="cancel-button" onClick={handleClose}>Close</button>
      </form>
    </Modal>
  );
};

export default InventoryModal;
