// src/layout/inventoryService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your Django API base URL

// Fetch all inventory items
export const getInventoryItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Add a new inventory item
export const addInventoryItem = async (item) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/inventory/`, item);
    return response.data;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

// Record a transaction
export const recordTransaction = async (transaction) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transactions/`, transaction);
    return response.data;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
};

// Optionally, you can add more functions for updating and deleting items

// Update an existing inventory item
export const updateInventoryItem = async (itemId, item) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/inventory/${itemId}/`, item);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (itemId) => {
  try {
    await axios.delete(`${API_BASE_URL}/inventory/${itemId}/`);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

// Fetch transactions for a specific inventory item

export const getItemTransactions = async (itemId) => {
  try {
    const [inventoryResponse, transactionsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/inventory/${itemId}/`),
      axios.get(`${API_BASE_URL}/transactions/?product=${itemId}`)
    ]);
    return {
      inventory: inventoryResponse.data,
      transactions: transactionsResponse.data
    };
  } catch (error) {
    console.error('Error fetching item transactions:', error);
    throw error;
  }
};

