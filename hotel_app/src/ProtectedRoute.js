import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; 

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" />;

  return element;
};

export default ProtectedRoute;
