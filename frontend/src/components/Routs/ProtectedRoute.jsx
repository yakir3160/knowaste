import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';

const ProtectedRoute = ({ element, allowGuest }) => {
    const currentUser = auth.currentUser;
    
    if (!currentUser && !allowGuest) {
        return <Navigate to="/auth" />;
    }

    console.log('Rendering Protected Route'); 
    return element;
};

export default ProtectedRoute;
