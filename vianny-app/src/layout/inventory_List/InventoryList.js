// src/layout/inventory_list/InventoryList.js

import React, { useState, useEffect } from 'react';
import { getInventoryItems, addInventoryItem, recordTransaction, deleteInventoryItem, updateInventoryItem } from '../inventoryService';
import InventoryModal from '../../modal/invnetory_list_modal/InventoryModal';
import TransactionModal from '../../modal/invnetory_list_modal/TransactionModal'; // Import TransactionModal
import EditInventoryModal from '../../modal/invnetory_list_modal/EditInventoryModal';
import './InventoryList.css';

const InventoryList = ({ loggedInUsername }) => { // Accept loggedInUsername prop
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [transactionModalIsOpen, setTransactionModalIsOpen] = useState(false); // State for TransactionModal
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null); // State for selected item ID
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item for editing

  useEffect(() => {
    // Fetch inventory items from Django
    getInventoryItems(loggedInUsername)
      .then(data => setInventory(data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, [loggedInUsername]);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleOpenEditModal = (item) => {
    console.log('Opening edit modal for item:', item); // Debug statement
    setSelectedItem(item);
    setEditModalIsOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (item) => {
    addInventoryItem(item)
      .then(data => {
        setInventory([...inventory, data]);
        // Record the transaction
        recordTransaction({
          product: data.id,
          transaction_type: 'Addition',
          quantity: item.reorder_level, // Use reorder_level as quantity
          remarks: 'Item added',
          unit_price: item.unit_price,
          username: loggedInUsername // Pass the username here
        })
        .catch(error => console.error('Error recording transaction:', error));
        setModalIsOpen(false);
      })
      .catch(error => console.error('Error adding inventory item:', error));
  };

  const handleUpdate = (item) => {
    updateInventoryItem(item.id, item)
      .then(() => {
        setInventory(inventory.map(i => (i.id === item.id ? item : i)));
        setEditModalIsOpen(false);
        setSelectedItem(null);
  
        // Create a new transaction record
        const newTransaction = {
          product: item.id,
          transaction_type: 'Update',
          quantity: item.reorder_level, // Adjust quantity if necessary
          transaction_date: new Date().toISOString(), // Backend will handle the date
          remarks: 'Item updated',
          unit_price: item.unit_price,
          username: loggedInUsername // Pass the username here
        };
  
        // Record the new transaction
        recordTransaction(newTransaction)
          .catch(error => console.error('Error recording new transaction:', error));
      })
      .catch(error => console.error('Error updating inventory item:', error));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        setInventory(inventory.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleView = (itemId) => {
    setSelectedItemId(itemId);
    setTransactionModalIsOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setTransactionModalIsOpen(false);
    setSelectedItemId(null);
  };

  return (
    <div className="inventory-list">
      <h2>Inventory List</h2>
      <button onClick={handleOpenModal}>Add Item</button> 
      <InventoryModal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        onSave={handleSave}
        username={loggedInUsername} // Pass the username here
      />
      <EditInventoryModal
        isOpen={editModalIsOpen}
        onRequestClose={handleCloseEditModal}
        selectedItem={selectedItem}
        onSave={handleUpdate}
        username={loggedInUsername}
      />
      <TransactionModal
        isOpen={transactionModalIsOpen}
        onRequestClose={handleCloseTransactionModal}
        itemId={selectedItemId}
      />
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Unit Price</th>
            <th>Quantity (Kgs|Pcs|Ltr)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const unitPrice = parseFloat(item.unit_price); // Convert unit_price to a number
            return (
              <tr key={item.id}> {/* Ensure the key is unique */}
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>shs:{unitPrice ? unitPrice.toFixed(2) : 'N/A'}</td>
                <td>{item.reorder_level}</td>
                <td>
                  <button className="actions-button" onClick={() => handleView(item.id)}>View</button>
                  <button className="actions-button" onClick={() => handleOpenEditModal(item)}>Update</button>
                  <button className="actions-button" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
