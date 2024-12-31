import React from 'react';

import LandingPageText from '../../constants/LandingPageText';
import featuredImage2 from '../../img/featured34-1@2x.png';
import "../../css/App.css";
import Button from "../Common/Button/Button";
import { useUserContext } from "../../contexts/UserContext";
import Hero from "../LandingPage/Hero";

const LandingPage = () => {
    return (
        <div className="w-full ">

                {/* Hero Text */}
                <Hero />

            {/*<div className="flex flex-row justify-center items-start w-full">*/}
            {/*   */}
            {/*    <div className="w-full">*/}
            {/*        <img*/}
            {/*            className="mr-12 rounded-[25px] w-full h-auto transition-transform duration-500 ease-in-out hover:scale-101"*/}
            {/*            src={featuredImage2}*/}
            {/*            alt="Food Waste"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <LandingPageText />
        </div>
    );
};

export default LandingPage;
