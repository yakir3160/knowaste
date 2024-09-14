import React from 'react';
import {Link} from 'react-router-dom';
import '../css/Login.css';
import featuredImage from '../img/sign-up-formIMG.png';
import Card from "./Card";
import Button from "./Button";
import GlobalField from "./GlobalField";

const Login = () => {
    return (
        <section className="contact-form-inner sm:flex-row">
            <Card
                style={{
                    minWidth: '40vh',
                    maxWidth:'50px',
                    height: "fit-content",
                    margin: "",

                }}>
                <h3 className="title" style={{alignSelf: "center", fontSize: "30px"}}>Login to your account</h3>
                <p>Enter your email to login</p>
                <GlobalField
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                />
                <GlobalField
                    type="password"
                    placeholder="Password"
                    name="password"
                />
                <Button className="login">Login</Button>
                <p className="already-have-an">don’t have an account?</p>
                <Button className="sign-up" to="/auth" state={{ showRegister: true }}>
                    Sign up
                </Button>
                <div className="terms-container">
                    <span>By clicking continue, you agree to our </span>
                    <a href="/terms" className="terms-of-service">Terms of Service</a>
                    <span> and </span>
                    <a href="/privacy" className="privacy-policy">Privacy Policy</a>
                </div>
            </Card>
        </section>
    );
}

export default Login;
