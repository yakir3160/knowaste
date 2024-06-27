import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = () => {
    const location = useLocation();
    const showRegister = location.state?.showRegister || false;

    return showRegister ? <Register /> : <Login />;
};

export default Auth;
