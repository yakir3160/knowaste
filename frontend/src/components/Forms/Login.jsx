import React, {useEffect} from 'react';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import * as Yup from "yup";
import {REQUIRED_MSG} from "../../constants/Constants";
import {useLocation}    from "react-router-dom";

import {Formik} from "formik";

const Login = () => {
    const location = useLocation();
    const emailFromRegister = location.state?.email || '';
    useEffect(() => {

    }, []);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required(REQUIRED_MSG),
        password: Yup.string()
            .required(REQUIRED_MSG),
    });
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const { toast } = await import('react-toastify');
        toast.success('Successfully logged in!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        resetForm();
        setSubmitting(false);
    };

    return (

        <>

            <Card className="flex flex-col max-w-[360px]">
                <h3 className="text-titles text-3xl p-5 text-center t">Login to your account</h3>
                <Formik
                    initialValues={{
                        email:emailFromRegister,
                        password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (

                        <form className="p-4 " noValidate>
                            {emailFromRegister && (
                                <div className="text-md text-center text-titles mb-4 ">
                                    This email is already registered. Please login to continue.
                                </div>
                            )}
                            <div className=" mb-3">
                                <GlobalField
                                    type="email"
                                    name="email"
                                    legend="Email"
                                />
                                <GlobalField
                                    type="password"
                                    name="password"
                                    legend="Password"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className={` flex flex-col gap-4`}>
                                    <Button
                                        className="bg-lime text-titles"
                                        type="submit"
                                        disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <div
                                                    className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles mr-3"></div>
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                    <Button
                                        className="relative bg-gradient-to-r from-[#4285F4] via-[#DB4437] to-[#F4B400]  rounded-md p-0.5 "
                                        type="button"
                                        disabled={isSubmitting}
                                    >
                                       <span className="relative z-10 flex justify-center items-center bg-white rounded-[25px] px-[10px] py-[10px] shadow-md hover:shadow-lg transition-shadow duration-200">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 48 48"
                                                    className="w-5 h-5 mr-2"
                                                >
                                                    <path fill="#EA4335"
                                                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                    <path fill="#4285F4"
                                                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                    <path fill="#FBBC05"
                                                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                    <path fill="#34A853"
                                                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                </svg>
                                               <span className="text-[#4285F4] font-semibold">Continue with Google</span>
                                       </span>
                                    </Button>

                                </div>
                                <div className="flex flex-row items-center p-2 m-2 mt-2 gap-2 h-fit">
                                    <p className="text-center my-4">Don’t have an account?</p>
                                    <Button
                                        className="text-buttons text-center"
                                        to="/auth" state={{showRegister: true}}>
                                        Sign up
                                    </Button>
                                </div>

                            </div>

                            <div className="text-center ">
                                <span>By clicking continue, you agree to our </span>
                                <a href="/terms" className="terms-of-service">Terms of Service</a>
                                <span> and </span>
                                <a href="/privacy" className="privacy-policy">Privacy Policy</a>
                            </div>

                        </form>
                    )}
                </Formik>
            </Card>
        </>
    );
}

export default Login;
