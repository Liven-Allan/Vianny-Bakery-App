// src/layout/Layout.js

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // Import the CSS file for styling

const Layout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Inventory Management</h1>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/inventory-list">Inventory List</Link></li>
            <li><Link to="/inventory-report">Inventory Report</Link></li>
          </ul>
          <h1>Production Management</h1>
          <ul>
            <li><Link to="/production-dashboard">Dashboard</Link></li>
            <li><Link to="/production-list">Production List</Link></li>
            <li><Link to="/production-report">Production Report</Link></li>
          </ul>
          <h1>Sales Management</h1>
          <ul>
            <li><Link to="/sales-dashboard">Sales Dashboard</Link></li>
            <li><Link to="/sales-stock">Sales Stock</Link></li>
            <li><Link to="/sales-list">Sales List</Link></li>
            <li><Link to="/sales-report">Sales Report</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet /> {/* This will render the child routes/components */}
      </main>
    </div>
  );
};

export default Layout;
