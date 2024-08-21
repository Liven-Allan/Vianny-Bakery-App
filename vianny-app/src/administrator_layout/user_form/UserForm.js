/* src/administrator_layout/user_form/UserForm.js */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = ({ userId, onClose }) => {
  const [user, setUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    userprofile: {
      role: '',
      status: ''
    }
  });

  const isEditing = !!userId; // Directly check if userId is present

  // Fetch user details if editing
  useEffect(() => {
    if (userId) {
      axios.get(`https://vianny-bakery-app.onrender.com/api/users/${userId}/`)
        .then(response => {
          const userData = response.data;
          setUser({
            ...userData,
            userprofile: userData.userprofile || { role: '', status: '' }
          });
          console.log('Fetched user data:', response.data); // Debugging
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role' || name === 'status') {
      setUser(prevUser => ({
        ...prevUser,
        userprofile: {
          ...prevUser.userprofile,
          [name]: value
        }
      }));
    } else {
      setUser(prevUser => ({
        ...prevUser,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      console.log('User data to save:', user); // Debugging

      const userData = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        userprofile: user.userprofile
      };

      if (isEditing) {
        await axios.put(`https://vianny-bakery-app.onrender.com/api/users/${userId}/`, userData);
      } else {
        await axios.post('https://vianny-bakery-app.onrender.com/api/users/', userData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Form fields */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={user.userprofile.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="inventory_representative">Inventory Representative</option>
            <option value="production_representative">Production Representative</option>
            <option value="sales_representative">Sales Representative</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={user.userprofile.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
