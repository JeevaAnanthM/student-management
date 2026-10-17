import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const destination = isAdmin
    ? '/admin/dashboard'
    : isAuthenticated
    ? '/student/dashboard'
    : '/login';

  return (
    <div className="container py-5 text-center my-auto">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h2 className="fw-bold text-dark mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The requested page does not exist or has been moved.
        </p>
        <Link to={destination} className="btn btn-primary-gradient px-4 py-2">
          <i className="bi bi-house-door-fill me-2"></i> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
