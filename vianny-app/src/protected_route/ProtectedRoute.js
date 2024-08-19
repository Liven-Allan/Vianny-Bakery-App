// src/protected_route/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, role, userRole, ...rest }) => {
  if (!userRole || (role && userRole !== role)) {
    // Redirect to login if not authenticated or not authorized
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
