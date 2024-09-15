import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import '../css/NavigationBar.css';
import '../css/App.css';
import Button from "./Button";

const NavigationBar = ({className = ""}) => {
    const [isScrolling, setScrolling] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >15) {
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
                <Button to="/contact" >Contact Us</Button>
                <Button to="/auth" state={{showRegister: false}} className="bg-lime "
                      style={{textDecoration: 'none', height: "fit-content"}}>Login</Button>
            </div>
        </div>
    );
};

export default NavigationBar;
