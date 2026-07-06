import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Enforce session decoding check
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <i className="bi bi-heart-pulse text-primary pulse-heart mb-3" style={{ fontSize: '3rem' }}></i>
        <h5 className="outfit-font fw-semibold text-secondary">Securing medical session context...</h5>
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role validation checks
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect contextually based on user role to their proper dashboard
    if (user.role === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
