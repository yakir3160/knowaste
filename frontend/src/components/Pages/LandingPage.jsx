import React from 'react';

import LandingPageText from '../../constants/LandingPageText';

import featuredImage2 from '../../img/featured34-1@2x.png';
import "../../css/App.css"
import Button from "../Common/Button/Button";

const LandingPage = () => {
    return (
        <div
            className="box-border flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 w-full">
            <Button to="/admin-panel">
                Admin Panel
            </Button>
            <div

                className="flex flex-col justify-start items-center mt-20 p-8 w-full min-h-screen text-center animate-fadeIn ]"
                style={{
                    // background: `linear-gradient(rgba(42, 82, 42, 0.8), rgba(255, 255, 255, 0.5)), url(${featuredImage1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <h1 className="mb-5 font-inherit text-[#2a522a] text-6xl sm:text- md:text-6xl lg:text-7xl 5xl">
                    Welcome To
                </h1>
                <h1 className="mb-5 font-semibold text-[#2a522a] text-6xl sm:text-xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl">
                    KNOWASTE
                </h1>

                <div className="font-inherit text-2xl leading-[150%] animate-fadeIn"
                     style={{animationDuration: "1.8s"}}>
                    And a subheading describing your site, too
                </div>
            </div>

            <div className="flex flex-row justify-center items-start w-full">
                <LandingPageText/>
                <div className="w-full">
                    <img
                        className="mr-12 rounded-[25px] w-full h-auto transition-transform duration-500 ease-in-out hover:scale-101"
                        src={featuredImage2}
                        alt="Food Waste"
                    />
                </div>
            </div>
            <Button to="/auth" state={{showRegister: true} }
                    className="bg-buttons p-4 border border-lime text-lime custom-hover-button {
">
                    Let's Sign Up!
            </Button>
        </div>

    );
};

export default LandingPage;
