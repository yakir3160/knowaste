import React, { useEffect, useState } from 'react';
import './Navbar.css';
import DesktopNavbar from '../Website/Desktop/DesktopNavbar';
import MobileNavbar from '../Website/Mobile/MobileNavbar';

const Navbar = () => {
    const [isScrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 15);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`navigation ${isScrolling ? 'glassy scrolling' : ''} flex justify-center animate-fadeInDown`}>
            {isMobile ? (
                <MobileNavbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            ) : (
                <DesktopNavbar />
            )}
        </nav>
    );
};

export default Navbar;
