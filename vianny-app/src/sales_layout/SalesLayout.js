/* src/sales_layout/SalesLayout.js */ 

import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './SalesLayout.css'; // Import the CSS file for styling

const SalesLayout = ({ handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function
    navigate('/'); // Redirect to the login page
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }; 

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <button className="toggle-sidebar" onClick={toggleSidebar}>
        ☰
      </button>
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

export default SalesLayout;
