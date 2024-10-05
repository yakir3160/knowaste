import React from 'react';
import Logo from '../../../Common/Logo/Logo';
import Button from '../../../Common/Button/Button';

const DesktopNavbar = () => {
    return (
        <div className=" w-[100%] hidden sm:flex flex-row gap-2 lg:gap-5 items-center justify-between pr-5 lg:pr-20">
            <Logo className={`text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg lg:pl-14`} />
            <div className="flex gap-4">
                <Button to="/contact">Contact Us</Button>
                <Button to="/auth" state={{ showRegister: false }} className="bg-lime">Login</Button>
            </div>
        </div>
    );
};

export default DesktopNavbar;
