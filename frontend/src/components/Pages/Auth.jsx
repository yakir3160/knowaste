import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../Forms/Login/Login/Login';
import Register from '../Forms/Register/Register';

const Auth = () => {
    const location = useLocation();
    const showRegister = location.state?.showRegister || false;
    return showRegister ? <Register /> : <Login />;
};

export default Auth;
