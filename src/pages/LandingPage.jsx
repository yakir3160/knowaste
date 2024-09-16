import React from 'react';
import { Link } from 'react-router-dom';

import LandingPageText from '../components/LandingPageText';
import featuredImage1 from '../img/food-waste_1.jpg';
import featuredImage2 from '../img/featured34-1@2x.png';
import "../css/App.css"
import Button from "../components/Button";

const LandingPage = () => {
    return (
        <div
            className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 box-border">
            <div
                className="min-h-screen  w-full p-8 text-center flex flex-col items-center justify-start mt-20 animate-fadeIn"
                style={{
                    // background: `linear-gradient(rgba(42, 82, 42, 0.8), rgba(255, 255, 255, 0.5)), url(${featuredImage1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <h1 className="text-6xl  sm:text 5xl md:text-6xl lg:text-7xl text-[#2a522a] font-inherit mb-5">
                    Welcome To
                </h1>
                <h1 className="text-7xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl text-[#2a522a] font-semibold mb-5">
                    KNOWASTE
                </h1>

                <div className="text-2xl leading-[150%] font-inherit animate-fadeIn"
                     style={{animationDuration: "1.8s"}}>
                    And a subheading describing your site, too
                </div>
            </div>

            <div className="w-full flex flex-row items-start justify-center  ">
                <LandingPageText/>
                <div className="w-full">
                    <img
                        className="rounded-[25px] mr-12 w-full h-auto transition-transform duration-500 ease-in-out hover:scale-101"
                        src={featuredImage2}
                        alt="Food Waste"
                    />
                </div>
            </div>
            <Button to="/auth" state={{showRegister: true}}
                    className="border-1 border-lime p-10 text-lime bg-buttons">
                    Let's Sign Up!
            </Button>
        </div>

    );
};

export default LandingPage;
