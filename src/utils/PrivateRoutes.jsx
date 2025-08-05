import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import { Navigate } from 'react-router-dom';

export const PrivateRoutes = ({children}) => {
    const { user, loading } = useAuth();
  
    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />; // Redirect to login if user is not authenticated
}
