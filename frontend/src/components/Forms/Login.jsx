import React, {useEffect} from 'react';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import * as Yup from "yup";
import {REQUIRED_MSG} from "../../constants/Constants";
import {toast, ToastContainer} from "react-toastify";
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
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            const userInfo = `          
                Email: ${values.email}
                Password: ${values.password}
            `;
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
        }, 1000);
    };
    return (

        <>
            <ToastContainer />
                <Card className="flex flex-col max-w-[360px]">
                <h3 className="text-titles text-4xl p-5 text-center t">Login to your account</h3>
                <p className={`text-titles text-[1rem] font-semibold`}>Enter your email and password to login</p>
                <Formik
                    initialValues={{email: '', password: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched, isSubmitting}) => (
                        <form className="p-4" noValidate>
                            <div className="mb-3">
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
                            <div
                                className="flex flex-col">
                                <Button className="bg-lime text-titles" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>

                                <p className="text-center my-4">don’t have an account?</p>
                                <Button className="bg-buttons p-4 border border-lime text-lime custom-hover-button  text-center" to="/auth" state={{showRegister: true}}>
                                    Sign up
                                </Button>
                            </div>

                            <div className="text-center my-2">
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
