import React, { useEffect, useState } from 'react';
import './Navbar.css';
import DesktopNavbar from '../Website/Desktop/DesktopNavbar';
import MobileNavbar from '../Website/Mobile/MobileNavbar';
import classNames from 'classnames';

const Navbar = () => {
    const [isScrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 15);
        };

        handleScroll(); // Initial check for scrolling
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navigation ${isScrolling ? 'glassy scrolling' : ''} flex justify-center animate-fadeInDown`}>
            <DesktopNavbar onLogoClick={() => setIsMenuOpen(false)} />
            <MobileNavbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} onLogoClick={() => setIsMenuOpen(false)} />
        </nav>
    );
};

export default Navbar;
