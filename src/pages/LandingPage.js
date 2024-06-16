import React from 'react';
import '../css/LandingPage.css';
import LandingPageText from '../components/LandingPageText';
import featuredImage from '../img/featured34-1@2x.png';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="head">
                <h1 className="welcome-to-knowaste">Welcome To KNOWASTE</h1>
                <div className="opening-text">And a subheading describing your site, too</div>
                <button className="button">
                    <div className="lets-sign-up">Let's Sign Up!</div>
                </button>
            </div>

            <div className="content">
                <LandingPageText />
                <div className="food-waste-img-container">
                    <img
                        className="food-waste-img"
                        src={featuredImage} // Updated image import
                        alt="Food Waste"
                    />
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
