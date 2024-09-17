import React, {useEffect, useState} from 'react';
import '../../css/App.css';
import "./Logo.css"
import {Link} from "react-router-dom";


const Logo = ({className,onClick}) => {

    return (
            <div className={`${className}flex justify-start align-middle min-w-[50px]`}>
                <Link to="/" onClick={onClick}  className="[text-shadow: text-decoration-none transition-colors duration-300 ] ease-in-out">
                    <b className="relative px-5 py-1.5 rounded-[35px] font-jaro text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg leading-[150%] transition-colors duration-100 ease-in-out logo self-stretch">
                        <span className="logo-text">KNO</span>
                        <span className={"text-lime w"}>W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
    );
};

export default Logo;
