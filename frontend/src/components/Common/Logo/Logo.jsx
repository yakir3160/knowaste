import React, {useEffect, useState} from 'react';
import '../../../css/App.css';
import "./Logo.css"
import {Link} from "react-router-dom";


const Logo = ({className,to = '/'}) => {

    return (
            <div  className={`${className}flex justify-start align-middle min-w-[50px] border-2 border-secondary  rounded-b-sm px-3 bg-secondary`}>
                <Link rel={"preload"} to={to} className="[text-shadow: text-decoration-none transition-colors duration-300 ]  ease-in-out">
                    <b className={` ${className}  transition-colors duration-100 ease-in-out logo self-stretch font-bold`}>
                        <span className="logo-text">KNO</span>
                        <span className={"text-lime w"}>W</span>
                        <span>ASTE</span>
                    </b>
                </Link>
            </div>
    );
};

export default Logo;
