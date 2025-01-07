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
            <Hero />
            <LandingPageText />
        </div>
    );
};

export default LandingPage;
