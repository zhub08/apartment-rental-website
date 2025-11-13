import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the nested route (the protected page)
  return <Outlet />;
};

export default ProtectedRoute;
