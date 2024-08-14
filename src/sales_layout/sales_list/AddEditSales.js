// src/sales_layout/sales_list/AddEditSales.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEditSales.css'; // Ensure the styles are imported

const AddEditSales = ({ onSave, onCancel }) => {
  const [sale, setSale] = useState({
    product_id: '',
    quantity_sold: 0,
    sales_amount: 0
  });
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    // Fetch products from SaleStocks API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/salestocks/');
        setStock(response.data);
        setProducts(response.data.map(stockItem => stockItem.product_id));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSale(prevSale => ({
      ...prevSale,
      product_id: productId,
      quantity_sold: 0, // Reset quantity and sales amount
      sales_amount: 0
    }));
  };

  const handleQuantityChange = (e) => {
    const quantitySold = parseInt(e.target.value, 10) || 0;
    const productId = sale.product_id;
    const stockItem = stock.find(item => item.product_id === productId);
    const maxQuantity = stockItem ? stockItem.quantity_obtained : 0;

    if (quantitySold > maxQuantity) {
      alert(`Quantity sold for ${productId} cannot exceed the available quantity of ${maxQuantity}.`);
      return; // Prevent updating state with invalid quantity
    }

    // Calculate sales amount based on the updated quantity sold
    const salesAmount = stockItem ? (stockItem.stock_amount ) * quantitySold : 0;

    setSale(prevSale => ({
      ...prevSale,
      quantity_sold: quantitySold,
      sales_amount: salesAmount
    }));
  };

  const updateStockQuantities = async () => {
    try {
      const productId = sale.product_id;
      const quantitySold = sale.quantity_sold;
      const stockItem = stock.find(item => item.product_id === productId);

      if (stockItem) {
        const updatedStockItem = {
          ...stockItem,
          quantity_obtained: stockItem.quantity_obtained - quantitySold
        };

        await axios.put(`http://localhost:8000/api/salestocks/${stockItem.id}/`, updatedStockItem);
      }
    } catch (error) {
      console.error('Error updating stock quantities:', error);
    }
  };

  const handleSave = async () => {
    try {
      const saleData = {
        product_id: sale.product_id,
        quantity_sold: sale.quantity_sold,
        sales_amount: sale.sales_amount
      };

      // Send POST request to create a new sale
      const response = await axios.post('http://localhost:8000/api/sales/', saleData);

      // Update stock quantities after sale is saved
      await updateStockQuantities();

      onSave(response.data);
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <h2>Add Sales Record</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label>Product Name:</label>
            <select onChange={handleProductChange} value={sale.product_id} required>
              <option value="">Select Product</option>
              {products.map((product, index) => (
                <option key={index} value={product}>{product}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity Sold:</label>
            <input
              type="number"
              value={sale.quantity_sold || ''}
              onChange={handleQuantityChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sales Amount:</label>
            <input
              type="number"
              value={sale.sales_amount || ''}
              readOnly
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSales;
