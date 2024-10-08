import React, {useEffect} from 'react';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import * as Yup from "yup";
import {REQUIRED_MSG} from "../../constants/Constants";

import {Formik} from "formik";

const Login = () => {

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
                <p className={`text-titles text-[1rem] font-semibold`}>Enter your email and password to login</p>
                <Formik
                    initialValues={{email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched, isSubmitting}) => (
                        <form className="p-4" noValidate>
                            <div className="">
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
                                    <Button className="bg-lime text-titles" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Logging in...' : 'Login'}
                                    </Button>
                                    <Button
                                        className="relative bg-gradient-to-r from-[#4285F4] via-[#DB4437] to-[#F4B400]  rounded-md p-0.5 "
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                    <span className="  relative z-10 block bg-white rounded-[25px] px-[10px] py-[10px]">
                                           Google
                                    </span>
                                    </Button>

                                </div>
                                <div className="flex flex-row items-center p-2 m-2 mt-2 gap-2 h-fit">
                                    <p className="text-center my-4">Don’t have an account?</p>
                                    <Button
                                        className="bg-buttons  border border-lime text-lime custom-hover-button text-center"
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
