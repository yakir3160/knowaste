import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="logo-container">
                <Link to="/" className="logo-link">
                    <b className="logo">
                        <span>KNO</span>
                        <span className="w_in_logo">W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
        </div>
    );
};

export default Footer;
