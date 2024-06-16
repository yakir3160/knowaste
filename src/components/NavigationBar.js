import React from 'react';
import '../css/NavigationBar.css';

const NavigationBar = ({ className = "" }) => {
    return (
        <div className={`navigation ${className}`}>
            <div className="mid-brand">
                <a href="/" className="logo-link">
                    <b className="logo">
                        <span>KNO</span>
                        <span className="w_in_logo">W</span>
                        <span>ASTE</span>
                    </b>
                </a>
            </div>
            <div className="right-nav-buttons">
                <a href="/contact" className="contact-us-link">Contact Us</a>
                <button className="login-btn">Login</button>
            </div>
        </div>
    );
};

export default NavigationBar;
