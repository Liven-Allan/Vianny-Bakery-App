/* src/production_layout/ProductionLayout.js */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './ProductionLayout.css'; // Import the CSS file for styling

const ProductionLayout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Production Management</h1>
        <nav>
          <ul>
            <li><Link to="/production-dashboard">Dashboard</Link></li>
            <li><Link to="/production-list">Production List</Link></li>
            <li><Link to="/production-report">Production Report</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet /> {/* This will render the child routes/components */}
      </main>
    </div>
  );
};

export default ProductionLayout;
