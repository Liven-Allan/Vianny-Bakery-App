// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout Component
import Layout from './layout/Layout';

// Import Inventory Management Components
import Dashboard from './layout/dashboard/Dashboard'; // Ensure this file exists
import InventoryList from './layout/inventory_List/InventoryList'; // Ensure this file exists
import InventoryReport from './layout/inventory_report/InventoryReport'; // Ensure this file exists

// Import Production Management Components
import ProductionDashboard from './production_layout/production_dashboard/ProductionDashboard'; // Ensure this file exists
import ProductionList from './production_layout/production_list/ProductionList'; // Ensure this file exists
import ProductionReport from './production_layout/production_report/ProductionReport'; // Ensure this file exists

// Import Sales Management Components
import SalesDashboard from './sales_layout/sales_dashboard/SalesDashboard'; // Ensure this file exists
import SalesStock from './sales_layout/sales_stock/SalesStock'; // Ensure this file exists
import SalesList from './sales_layout/sales_list/SalesList'; // Ensure this file exists
import SalesReport from './sales_layout/sales_report/SalesReport'; // Ensure this file exists

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Layout />}>
          {/* Inventory Management Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory-list" element={<InventoryList />} />
          <Route path="inventory-report" element={<InventoryReport />} />
          
          {/* Production Management Routes */}
          <Route path="production-dashboard" element={<ProductionDashboard />} />
          <Route path="production-list" element={<ProductionList />} />
          <Route path="production-report" element={<ProductionReport />} />
          
          {/* Sales Management Routes */}
          <Route path="sales-dashboard" element={<SalesDashboard />} />
          <Route path="sales-stock" element={<SalesStock />} />
          <Route path="sales-list" element={<SalesList />} />
          <Route path="sales-report" element={<SalesReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
