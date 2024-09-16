import React, {useEffect, useState} from 'react';
import '../../css/App.css';
import "./Logo.css"
import {Link} from "react-router-dom";


const Logo = ({className}) => {

    return (
            <div className={`${className}flex justify-start align-middle min-w-[50px]`}>
                <Link to="/" className="text-decoration-none transition-colors duration-300 ease-in-out [text-shadow: ]">
                    <b className="  logo self-stretch relative leading-[150%]  rounded-[35px]
                    font-jaro  transition-colors duration-100 ease-in-out
                    py-1.5 px-7 text-logo-sm sm:text-logo-md md:text-logo-md lg:text-logo-lg
                    ">
                        <span className="logo-text ">KNO</span>
                        <span className={"text-lime w"}>W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
    );
};

export default Logo;
