import React, { useEffect, useState } from 'react';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import * as Yup from "yup";
import { REQUIRED_MSG } from "../../constants/Constants";
import { useLocation } from "react-router-dom";
import { Form, Formik } from "formik";
import GoogleSignInBtn from "../Common/GoogleSignInBtn/GoogleSignInBtn";
import { useAuthContext } from "../../contexts/AuthContext";
import { MailCheck } from "lucide-react";
import { Player } from '@lottiefiles/react-lottie-player';

import loadingAnimation from '../../animations/AnimationLoading.json';
const Login = () => {
    const { login, authError, clearAuthError, passwordResetEmail, emailSent, loading } = useAuthContext();
    const location = useLocation();
    const emailFromRegister = location.state?.email || '';
    const message = location.state?.message || '';
    const messageType = location.state?.type;
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        clearAuthError();
    }, []);

    useEffect(() => {
        if (emailSent && !loading) {
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }, [emailSent]);

    const handlePasswordReset = async (values) => {
        setIsResetting(true);
        await passwordResetEmail(values);
        setIsResetting(false);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required(REQUIRED_MSG),
        password: Yup.string()
            .required(REQUIRED_MSG),
    });

    const getDisplayError = () =>
        emailFromRegister ? "This email is already registered. Please login to continue." :
            message || null ||
            authError || null;

    return (
        <Card className="flex flex-col max-w-[360px]">
            {emailSent ? (
                <div className="text-green text-xl font-semibold text-center w-fit p-5">
                    <MailCheck className="h-12 w-12 mx-auto animate-fadeIn"/>
                    <span className="block my-7 animate-fadeInDown">
                        Check your email for password reset instructions
                    </span>
                </div>
            ) : (
                <>
                    <h3 className="text-titles text-3xl p-3 text-center">Login to your account</h3>
                    <Formik
                        initialValues={{
                            email: emailFromRegister,
                            password: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={login}
                        enableReinitialize={true}
                    >
                        {({ isSubmitting, values }) => (
                            <Form className="p-4" noValidate>
                                <div className="mb-3">
                                    <GlobalField
                                        type="email"
                                        name="email"
                                        label="Email"
                                        autoFocus={true}
                                    />

                                    <GlobalField
                                        type="password"
                                        name="password"
                                        label="Password"
                                    />
                                    <div
                                        className={`text-md text-center ${messageType !== 'success' ? 'text-errorRed' : 'text-green'} h-fit`}>
                                        {getDisplayError()}
                                    </div>

                                    <div className="flex flex-col items-center justify-center p-2  h-fit">
                                        <button
                                            type="button"
                                            onClick={() => handlePasswordReset(values)}
                                            className="text-titles text-md flex items-center gap-2"
                                            disabled={isResetting}
                                        >
                                            {isResetting ? (
                                                <>
                                                    Sending reset email...
                                                </>
                                            ) : (
                                                'Forgot your password?'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-col gap-4">
                                        <Button
                                            className="bg-lime text-titles flex justify-center items-center"
                                            type="submit"
                                            disabled={isSubmitting || loading} // Disable if submitting or loading
                                        >
                                            {isSubmitting || loading ? (
                                                <>
                                                    Logging in...
                                                    <Player
                                                        autoplay
                                                        loop
                                                        src={loadingAnimation}
                                                        className="size-6"
                                                    />
                                                </>
                                            ) : (
                                                'Login'
                                            )}
                                        </Button>
                                        <div className="flex items-center">
                                            <div className="flex-1 border-t border-gray"></div>
                                            <span className="px-4 text-gray">or</span>
                                            <div className="flex-1 border-t border-gray"></div>
                                        </div>
                                        <GoogleSignInBtn isSubmitting={isSubmitting}/>
                                    </div>
                                    <div className="flex flex-row items-center p-2 m-2 mt-2 gap-2 h-fit">
                                        <p className="text-center my-4">Don't have an account?</p>
                                        <Button
                                            className="text-buttons text-center"
                                            to="/auth"
                                            state={{ showRegister: true }}
                                        >
                                            Sign up
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span>By clicking continue, you agree to our </span>
                                    <a href="/terms" className="terms-of-service">Terms of Service</a>
                                    <span> and </span>
                                    <a href="/privacy" className="privacy-policy">Privacy Policy</a>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            )}
        </Card>
    );
};

export default Login;
