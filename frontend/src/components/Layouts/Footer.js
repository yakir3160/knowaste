import React from 'react';
import Logo from "../Common/Logo/Logo";

const Footer = () => {
    return (
        <div className="w-full bg-secondary text-center  ">
               <Logo className={`text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg`} />
        </div>
    );
};

export default Footer;
