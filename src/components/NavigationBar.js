import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavigationBar.css';
import Button from './Button';
import Logo from './Logo/Logo';

const NavigationBar = () => {
    const [isScrolling, setScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
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
    }, []);

    return (
        <div className={`navigation ${isScrolling ? 'glassy scrolling' : ''}`}>
            <Logo className="pl-0 lg:pl-10" />
            <div className="flex flex-row gap-2 lg:gap-5 items-center justify-between pr-5 lg:pr-20 sm:items-end">
                <Button className={"bg-base"} to="/contact">Contact Us</Button>
                <Button to="/auth" state={{ showRegister: false }} className="bg-lime">Login</Button>
            </div>
        </div>
    );
};

export default NavigationBar;
