import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  
  // Show loading while checking authentication
  if (token && !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Render protected content if authenticated
  return children;
}