import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';

const ProtectedRoute = ({ element, allowGuest }) => {
    const currentUser = auth.currentUser;

    console.log('Current User:', currentUser); // Log current user

    if (!currentUser && !allowGuest) {
        return <Navigate to="/auth" />;
    }

    console.log('Rendering Protected Route'); // Log when rendering the protected route
    return element;
};

export default ProtectedRoute;
