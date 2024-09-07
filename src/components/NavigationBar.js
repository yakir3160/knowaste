import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import '../css/NavigationBar.css';
import '../css/App.css';

const NavigationBar = ({className = ""}) => {
    const [isScrolling, setScrolling] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >10) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        <div className={`navigation ${isScrolling ? 'glassy' : ''} ${className} min-w-fit`}>
            <div className="mid-brand ">
                <Link to="/" className="logo-link">
                    <b className="logo font-jaro">
                        <span className="logo-text ">KNO</span>
                        <span style={{color: "var(--lime-color)"}}>W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
            <div className="right-nav-buttons">
                <Link to="/contact" className="contact-us-link">Contact Us</Link>
                <Link to="/auth" state={{showRegister: false}} className="login-btn"
                      style={{textDecoration: 'none', height: "fit-content"}}>Login</Link>
            </div>
        </div>
    );
};

export default NavigationBar;
