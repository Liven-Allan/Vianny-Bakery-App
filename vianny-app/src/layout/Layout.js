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
          {/**<li><Link to="/inventory-dashboard">Dashboard</Link></li> */}  
            <li><Link to="/inventory-list">Inventory List</Link></li>
          {/*  <li><Link to="/inventory-report">Inventory Report</Link></li> */}
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
