import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthenticatedRoute;
