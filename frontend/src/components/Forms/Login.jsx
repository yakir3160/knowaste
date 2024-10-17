import React, {useEffect} from 'react';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import * as Yup from "yup";
import {REQUIRED_MSG} from "../../constants/Constants";
import {useLocation}    from "react-router-dom";

import {Formik} from "formik";
import GoogleSignIn from "../Common/GoogleSignIn/GoogleSignIn";

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
                                    <GoogleSignIn isSubmitting={isSubmitting} />
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
