import React from 'react';
import Button from '../../../Common/Button/Button';
import classNames from 'classnames';
import Logo from "../../../Common/Logo/Logo";

const MobileNavbar = ({ isMenuOpen, toggleMenu }) => {
    return (
        <div className="flex justify-center items-center gap-x-5 pl-16">
            <Logo className={` flex-grow text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg`}/>
            <button onClick={toggleMenu} className="menu-button">
                <div className={classNames(`tham tham-e-squeeze tham-w-7`, { 'tham-active': isMenuOpen })}>
                    <div className="tham-box">
                        <div className="tham-inner text-titles" />
                    </div>
                </div>
            </button>
            <div
                className={`absolute top-[100%] right-0 w-fit h-screen bg-white shadow-lg  z-50 p-10 ${
                    isMenuOpen ? 'animate-slideIn' : 'animate-slideOut'
                }`}
            >
                <Button to="/contact" onClick={toggleMenu} className={`block mb-4`}>
                    Contact Us
                </Button>
                <Button to="/auth" state={{ showRegister: false }} className="bg-lime block text-center" onClick={toggleMenu}>
                    Login
                </Button>
            </div>
        </div>
    );
};

export default MobileNavbar;
