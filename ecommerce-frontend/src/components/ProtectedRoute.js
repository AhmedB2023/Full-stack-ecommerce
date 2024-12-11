import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }) {
    if (!user) {
        // Redirect to login if user is not logged in
        return <Navigate to="/login" />;
    }
    // Render children if user is logged in
    return children;
}

export default ProtectedRoute;
