import React from 'react';
import Button from '../../../Common/Button/Button';
import classNames from 'classnames';
import Logo from "../../../Common/Logo/Logo";
import {useAuthContext} from "../../../../context/AuthContext";
import {CircleUserRound} from "lucide-react";

const MobileNavbar = ({ isMenuOpen, toggleMenu }) => {
    const  {user} = useAuthContext();
    return (
        <div className={`flex justify-between items-center pb-1 `}>
            {user !== null && (
                <Button
                    to="/admin-panel"
                    className=" mr-2 ml-3 mt-2 border border-lime text-titles  p-3 "
                ><CircleUserRound/>
                </Button>
            )}
            <div className={user !== null && `mr-[70px]`}>
                <Logo className="flex-grow text-logo-sm md:mt-5  md:text-logo-md lg:text-logo-lg" />
                <div
                    className={`absolute top-0 right-0 w-fit h-screen bg-white shadow-lg z-50 p-10 transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <button
                        onClick={toggleMenu}
                        className="absolute top-0 left-[-60px] z-[60] flex items-center bg-secondary  rounded-l-2xl justify-center px-4 py-6 transition-all duration-[100ms]"
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
                    {user === null && (
                        <Button
                            to="/admin-panel"
                            className="bg-lime text-titles flex justify-center"
                            onClick={toggleMenu}
                        >
                            Login
                        </Button>
                    ) }

                </div>
            </div>
        </div>

    );
};

export default MobileNavbar;
