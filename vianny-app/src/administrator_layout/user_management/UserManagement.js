/* src/administrator_layout/user_management/UserManagement.js */ 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import UserForm from '../user_form/UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUserId(null);
    setRefresh(prev => !prev);
  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${userId}/`);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAdd = () => {
    setEditingUserId(null);
    setShowForm(true);
  };

 // if (loading) return <p>Loading...</p>;
 // if (error) return <p>Error loading users!</p>;

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <div className="button-container">
        <button className="add-record-button" onClick={handleAdd}>Add User</button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>X</button>
            <UserForm
              userId={editingUserId}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
      <div className="table-container">
        <table className="user-management-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.email}</td>
                <td>{user.userprofile ? user.userprofile.role : 'N/A'}</td>
                <td>{user.userprofile ? user.userprofile.status : 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

