import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import Logo from "./Logo/Logo";

const Footer = () => {
    return (
        <div className="footer">
            <div className="logo-container">
               <Logo/>
            </div>
        </div>
    );
};

export default Footer;
