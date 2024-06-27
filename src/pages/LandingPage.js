import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css'; // Ensure this path is correct
import LandingPageText from '../components/LandingPageText';
import featuredImage from '../img/featured34-1@2x.png';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="head">
                <h1 className="welcome-to-knowaste">Welcome To KNOWASTE</h1>
                <div className="opening-text">And a subheading describing your site, too</div>
                <Link to="/auth" state={{ showRegister: true }} className="button" style={{textDecoration: 'none',height:"fit-content"}}>
                    <div className="lets-sign-up">Let's Sign Up!</div>
                </Link>
            </div>
            <div className="content">
                <LandingPageText />
                <div className="food-waste-img-container">
                    <img
                        className="food-waste-img"
                        src={featuredImage}
                        alt="Food Waste"
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
