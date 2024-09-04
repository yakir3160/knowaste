import React from 'react';
import {Link} from 'react-router-dom';
import '../css/Login.css';
import featuredImage from '../img/sign-up-formIMG.png';
import Card from "./Card";

const Login = () => {
    return (
        <section className="contact-form-inner sm:flex-row">
                <Card
                     style={{
                         minWidth: '50vh',
                         maxWidth:'50vh',
                         height: "fit-content",
                         margin: "",

                     }}>
                    <h3 className="title" style={{alignSelf: "center", fontSize: "35px"}}>Login to your account</h3>
                    <p>Enter your email to login</p>
                    <input
                        id="email"
                        className="input"
                        type="email"
                        placeholder="email@domain.com"
                        style={{
                            width: '92%',
                            height: "fit-content",
                            fontWeight: "400",
                            fontSize: "20px",
                            boxShadow: 'inset 6px 6px 12px rgba(203, 209, 184, 0.60), inset -6px -6px 12px #feffef'
                        }}
                    />
                    <input
                        id="password"
                        className="input"
                        type="password"
                        placeholder="Password"
                        style={{
                            width: '92%',
                            height: 'fit-content',
                            fontWeight: '400',
                            fontSize: '20px',
                            boxShadow: 'inset 6px 6px 12px rgba(203, 209, 184, 0.60), inset -6px -6px 12px #feffef'
                        }}

                    />
                    <button className="login">Login</button>
                    <p className="already-have-an">don’t have an account?</p>
                    <Link to="/auth" state={{showRegister: true}} className="sign-up">Sign up</Link>
                    <div className="terms-container">
                        <span>By clicking continue, you agree to our </span>
                        <a href="/terms" className="terms-of-service">Terms of Service</a>
                        <span> and </span>
                        <a href="/privacy" className="privacy-policy">Privacy Policy</a>
                    </div>
                </Card>
            <div style={{maxWidth: "60vh", marginRight: "-8%", marginLeft: "15%"}}>
                <img src={featuredImage} alt=""/>
            </div>
        </section>
    );
}

export default Login;
