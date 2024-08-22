/* src/production_layout/ProductionLayout.js */

import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './ProductionLayout.css'; // Import the CSS file for styling

const ProductionLayout = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Production Management</h1>
        <nav>
          <ul>
            {/*<li><Link to="/production-dashboard">Dashboard</Link></li>*/}
            <li><Link to="/production-list">Production List</Link></li>
            {/* <li><Link to="/production-report">Production Report</Link></li> */}
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

export default ProductionLayout;
