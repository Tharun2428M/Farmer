import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Guard Component
 * @param {Array<string>} allowedRoles - Optional list of allowed roles (e.g. ['CUSTOMER', 'FARMER', 'ADMIN'])
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verifying authentication session..." fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login page with return state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // Redirect users without required role permissions to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
