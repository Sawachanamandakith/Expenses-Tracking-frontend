import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if(loading){
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-incomeBC h-16 w-16"></div>
    </div>
  )}

  if (!isAuthenticated) {
    console.warn("User not authenticated. Redirecting to login.");
    return <Navigate to="/" replace />;
  };

  return children;
};

export default PrivateRoute;