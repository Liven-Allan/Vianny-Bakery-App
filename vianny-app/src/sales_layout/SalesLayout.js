/* src/sales_layout/SalesLayout.js */ 

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './SalesLayout.css'; // Import the CSS file for styling

const SalesLayout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Sales Management</h1>
        <nav>
          <ul>
           {/**<li><Link to="/sales-dashboard">Sales Dashboard</Link></li> */} 
            <li><Link to="/sales-stock">Sales Stock</Link></li>
            <li><Link to="/sales-list">Sales List</Link></li>
           {/**<li><Link to="/sales-report">Sales Report</Link></li> */} 
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet /> {/* This will render the child routes/components */}
      </main>
    </div>
  );
};

export default SalesLayout;
