import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';
import LandingPageText from '../components/LandingPageText';
import featuredImage from '../img/featured34-1@2x.png';
import "../css/App.css"

const LandingPage = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-12 p-5 box-border ">
            <div
                className="min-h-screen  w-full p-8 text-center flex flex-col items-center justify-start mt-20 animate-fadeIn">
                <h1 className="text-5xl text-[#2a522a] font-inherit mb-5">
                    Welcome To
                </h1>
                <h1 className="text-9xl text-[#2a522a] font-semibold mb-5">
                    KNOWASTE
                </h1>
                <div className="text-2xl leading-[150%] font-inherit animate-fadeIn" style={{ animationDuration: "2s" }}>
                    And a subheading describing your site, too
                </div>
            </div>

            <div className="w-full flex flex-row items-start justify-center   ">
                <LandingPageText/>
                <div className="w-full">
                    <img
                        className="rounded-[25px] mr-12 w-full h-auto transition-transform duration-500 ease-in-out hover:scale-101"
                        src={featuredImage}
                        alt="Food Waste"
                    />
                </div>
            </div>
            <Link to="/auth" state={{showRegister: true}}
                  className="button bg-[#3b763b] border-none py-5 px-10 w-fit h-[72px] rounded-[35px] flex items-center justify-center mt-7 transition-all duration-300 ease-in-out hover:bg-[#619c61] hover:scale-[.98] hover:border-[1px] hover:border-lime-500"
                  style={{textDecoration: 'none', height: "fit-content"}}>
                <div className="text-lg font-medium text-lime-400">
                    Let's Sign Up!
                </div>
            </Link>
        </div>

    );
};

export default LandingPage;
