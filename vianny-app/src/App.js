import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './administrator_layout/AdminLayout';
//import AdminDashboard from './administrator_layout/admin_dashboard/AdminDashboard'; 
import UserManagement from './administrator_layout/user_management/UserManagement'; 

// Import Inventory Management Components
import Layout from './layout/Layout';
//import Dashboard from './layout/dashboard/Dashboard'; 
import InventoryList from './layout/inventory_List/InventoryList'; 
//import InventoryReport from './layout/inventory_report/InventoryReport'; 

// Import Sales Management Components
import SalesLayout from './sales_layout/SalesLayout';
//import SalesDashboard from './sales_layout/sales_dashboard/SalesDashboard';
import SalesStock from './sales_layout/sales_stock/SalesStock';
import SalesList from './sales_layout/sales_list/SalesList';
//import SalesReport from './sales_layout/sales_report/SalesReport';

// Import Production Management Components
import ProductionLayout from './production_layout/ProductionLayout';
//import ProductionDashboard from './production_layout/production_dashboard/ProductionDashboard'; 
import ProductionList from './production_layout/production_list/ProductionList'; 
//import ProductionReport from './production_layout/production_report/ProductionReport'; 

// Import Administrator-Specific Components
import AdminInventoryDashboard from './administrator_layout/dashboard/AdminInventoryDashboard';
import AdminProductionDashboard from './administrator_layout/production_dashboard/AdminProductionDashboard';
import AdminSalesDashboard from './administrator_layout/sales_dashboard/AdminSalesDashboard';
import AdminInventoryReport from './administrator_layout/inventory_report/AdminInventoryReport';
import AdminProductionReport from './administrator_layout/production_report/AdminProductionReport';
import AdminSalesReport from './administrator_layout/sales_report/AdminSalesReport';
import AdminProductionList from './administrator_layout/production_list/AdminProductionList';
import AdminSalesStock from './administrator_layout/sales_stock/AdminSalesStock';
import Login from './login/Login'; // Import the Login component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [userRole, setUserRole] = useState(''); // State to track user role
  const [loggedInUsername, setLoggedInUsername] = useState(''); // State to track logged-in username

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setLoggedInUsername('');
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to={`/${userRole}-dashboard`} /> : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} setLoggedInUsername={setLoggedInUsername} />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/" element={isAuthenticated && userRole === 'admin' ? <AdminLayout handleLogout={handleLogout} /> : <Navigate to="/" />}>
          <Route path="user-management" element={<UserManagement />} />
          <Route path="admin-inventory-dashboard" element={<AdminInventoryDashboard />} />
          <Route path="admin-production-dashboard" element={<AdminProductionDashboard />} />
          <Route path="admin-sales-dashboard" element={<AdminSalesDashboard />} />
          <Route path="admin-inventory-report" element={<AdminInventoryReport />} />
          <Route path="admin-production-report" element={<AdminProductionReport />} />
          <Route path="admin-sales-report" element={<AdminSalesReport />} />
          <Route path="admin-production-list" element={<AdminProductionList />} />
          <Route path="admin-stock-list" element={<AdminSalesStock />} />
        </Route>

        {/* Inventory Management Routes - Protected */}
        <Route path="/" element={isAuthenticated && userRole === 'inventory_representative' ? <Layout handleLogout={handleLogout} /> : <Navigate to="/" />}>
        {/* <Route path="inventory-dashboard" element={<Dashboard />} /> */}
          <Route path="inventory-list" element={<InventoryList loggedInUsername={loggedInUsername} />} />
        {/*  <Route path="inventory-report" element={<InventoryReport />} /> */}
        </Route>

        {/* Sales Management Routes - Protected */}
        <Route path="/" element={isAuthenticated && userRole === 'sales_representative' ? <SalesLayout handleLogout={handleLogout} /> : <Navigate to="/" />}>
         {/*  <Route path="sales-dashboard" element={<SalesDashboard />} /> */}
          <Route path="sales-stock" element={<SalesStock loggedInUsername={loggedInUsername} />} />
          <Route path="sales-list" element={<SalesList loggedInUsername={loggedInUsername} />} />
         {/* <Route path="sales-report" element={<SalesReport />} /> */}
        </Route>

        {/* Production Management Routes - Protected */}
        <Route path="/" element={isAuthenticated && userRole === 'production_representative' ? <ProductionLayout handleLogout={handleLogout} /> : <Navigate to="/" />}>
         {/* <Route path="production-dashboard" element={<ProductionDashboard />} /> */}
          <Route path="production-list" element={<ProductionList loggedInUsername={loggedInUsername} />} />
         {/* <Route path="production-report" element={<ProductionReport />} /> */}
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
