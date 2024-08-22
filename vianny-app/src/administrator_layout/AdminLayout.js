/* src/administrator_layout/AdminLayout.js */ 

import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; // Import the CSS file for styling

const AdminLayout = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function
    navigate('/'); // Redirect to the login page
  };
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Admin Management</h1>
        <nav>
          <ul>
            <li><Link to="/user-management">User Management</Link></li>
            <li><Link to="/admin-inventory-dashboard">Inventory Dashboard</Link></li>
            <li><Link to="/admin-production-dashboard">Production Dashboard</Link></li>
            <li><Link to="/admin-sales-dashboard">Sales Dashboard</Link></li>
            <li><Link to="/admin-inventory-report">Inventory Report</Link></li>
            <li><Link to="/admin-production-report">Production Report</Link></li>
            <li><Link to="/admin-sales-report">Sales Report</Link></li>
            <li><Link to="/admin-production-list">Production List</Link></li>
            <li><Link to="/admin-stock-list">Sales Stock List</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogoutClick} className="logout-button">
          Logout
        </button>
      </aside>
      <main className="content">
        <Outlet /> {/* This will render the child routes/components */}
      </main>
    </div>
  );
};

export default AdminLayout;
