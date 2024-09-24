import React from 'react';
import Logo from "./Logo/Logo";

const Footer = () => {
    return (
        <div className="flex-shrink-0 w-full bg-secondary text-center mt-5">
               <Logo className={`text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg`} />
        </div>
    );
};

export default Footer;
