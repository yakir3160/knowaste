import React, { useEffect, useState } from 'react';
import '../css/NavigationBar.css';
import Button from './Button';
import Logo from './Logo/Logo';
import classNames from 'classnames';

const NavigationBar = () => {
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
        <nav className={`navigation ${isScrolling ? 'glassy scrolling' : ''} flex justify-center  lg:justify-between animate-fadeInDown`}>
            <Logo  onClick={() => setIsMenuOpen(false)}/>
            {/*Mobile Menu*/}
            <div className=" sm:hidden -mr-16 ml-4">
                <button onClick={toggleMenu} className="menu-button">
                    <div className={classNames(`tham tham-e-squeeze tham-w-7`, {'tham-active': isMenuOpen})}>
                        <div className="tham-box">
                            <div className="tham-inner text-titles"/>
                        </div>
                    </div>
                </button>

                <div
                    className={`absolute top-[100%] right-0  w-fit h-screen bg-baseLight shadow-lg z-50 p-10 ${
                        isMenuOpen ? 'animate-slideIn' : 'animate-slideOut'
                    }`}
                >
                    <Button
                        to="/contact"
                        onClick={toggleMenu}
                        className="block mb-4"
                    >
                        Contact Us
                    </Button>
                    <Button
                        to="/auth"
                        state={{showRegister: false}}
                        className="bg-lime block text-center"
                        onClick={toggleMenu}
                    >
                        Login
                    </Button>
                </div>
            </div>
            {/*Normal Menu*/}
            <div
                className="hidden sm:flex flex-row gap-2 lg:gap-5 items-center justify-between pr-5 lg:pr-20 sm:items-end ">
                <Button to="/contact">Contact Us</Button>
                <Button to="/auth" state={{showRegister: false}} className="bg-lime">Login</Button>
            </div>
        </nav>
    );
};

export default NavigationBar;