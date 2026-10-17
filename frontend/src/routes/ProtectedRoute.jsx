import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  // If user is not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is restricted to ADMIN, and user is a STUDENT, deny access and redirect to student dashboard
  if (requiredRole === 'ADMIN' && user?.role !== 'ADMIN') {
    return <Navigate to="/student/dashboard" replace />;
  }

  // If route is student-only and user is an ADMIN, navigate to admin dashboard
  if (requiredRole === 'STUDENT' && user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
