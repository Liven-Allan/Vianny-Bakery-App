// src/modal/inventory_list_modal/EditInventoryModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './EditInventoryModal.css'; // Ensure this path is correct

Modal.setAppElement('#root'); // For accessibility

const EditInventoryModal = ({ isOpen, onRequestClose, selectedItem, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    unit_price: '',
    reorder_level: ''
  });

  useEffect(() => {
    
    if (selectedItem) {
      setFormData({
        id: selectedItem.id || '',
        name: selectedItem.name || '',
        category: selectedItem.category || '',
        unit_price: selectedItem.unit_price || '',
        reorder_level: selectedItem.reorder_level || ''
      });
    }
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Inventory Item"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2>Update Inventory Item</h2>
      </div>
      {formData ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Unit Price:
            <input
              type="number"
              name="unit_price"
              value={formData.unit_price || ''}
              onChange={handleChange}
            />
          </label>
          <label>
          Quantity (Kgs|Pcs|Ltr):
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level || ''}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onRequestClose}>Close</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default EditInventoryModal;

