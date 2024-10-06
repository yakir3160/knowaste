import React from 'react';
import Button from '../../../Common/Button/Button';
import classNames from 'classnames';
import Logo from "../../../Common/Logo/Logo";

const MobileNavbar = ({ isMenuOpen, toggleMenu }) => {
    return (
        <div className="flex justify-center items-center ">
            <Logo className="flex-grow text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg" />
            <div
                className={`absolute top-0 right-0 w-fit h-screen bg-white shadow-lg z-50 p-10 transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <button
                    onClick={toggleMenu}
                    className="absolute top-5 left-[-60px] z-[60] flex items-center bg-secondary  rounded-l-2xl justify-center px-4 py-4 transition-all duration-[100ms]"
                >
                    <div className={classNames('tham tham-e-squeeze tham-w-7', {'tham-active': isMenuOpen})}>
                        <div className="tham-box">
                            <div className="tham-inner  text-titles" />
                        </div>
                    </div>
                </button>

                <Button to="/contact" onClick={toggleMenu} className="block mb-4">
                    Contact Us
                </Button>
                <Button
                    to="/auth"
                    state={{ showRegister: false }}
                    className="bg-lime block text-center"
                    onClick={toggleMenu}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default MobileNavbar;
