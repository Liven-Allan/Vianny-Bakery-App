/* src/administrator_layout/AdminLayout.js */ 

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './AdminLayout.css'; // Import the CSS file for styling

const AdminLayout = () => {
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
      </aside>
      <main className="content">
        <Outlet /> {/* This will render the child routes/components */}
      </main>
    </div>
  );
};

export default AdminLayout;
