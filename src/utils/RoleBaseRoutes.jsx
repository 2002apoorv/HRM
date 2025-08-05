import React from 'react';
import { useAuth } from '../context/authContext.jsx';
import { Navigate } from 'react-router-dom';

export const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("fsfsd")

  const normalizedRole = user?.role?.trim().toLowerCase();
  console.log("Normalized User Role:", normalizedRole);

  if (!requiredRole.map(r => r.toLowerCase()).includes(normalizedRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return user ? children : <Navigate to="/login" />;
};
