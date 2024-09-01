import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavigationBar.css';
import '../css/App.css';

const NavigationBar = ({ className = "" }) => {
    return (
        <div className={`navigation ${className}`}>
            <div className="mid-brand">
                <Link to="/" className="logo-link">
                    <b className="logo">
                        <span>KNO</span>
                        <span style={{color: "var(--lime-color)"}}>W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
            <div className="right-nav-buttons">
                <Link to="/contact" className="contact-us-link">Contact Us</Link>
                <Link to="/auth" state={{ showRegister: false }} className="login-btn" style={{ textDecoration: 'none', height: "fit-content" }}>Login</Link>
            </div>
        </div>
    );
};

export default NavigationBar;
