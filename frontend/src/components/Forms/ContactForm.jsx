import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import {REQUIRED_MSG} from "../../constants/Constants";
import {SendHorizontal} from "lucide-react";
import {Player} from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../animations/AnimationLoading.json";

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);


    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(/^[\u0590-\u05FFa-zA-Z\s]+$/, 'First name should contain only English or Hebrew characters and spaces')
            .required(REQUIRED_MSG),
        lastName: Yup.string()
            .matches(/^[\u0590-\u05FFa-zA-Z\s]+$/, 'Last name should contain only English or Hebrew characters and spaces')
            .required(REQUIRED_MSG),
        email: Yup.string()
            .email('Invalid email address')
            .required(REQUIRED_MSG),
        message: Yup.string()
            .required(REQUIRED_MSG),
    });

    return (
            <>
                <Card className="min-w-[360px]">
                    <h3 className="text-titles text-4xl p-4 text-center">Contact us</h3>
                    {!submitted ? (
                        <Formik
                            initialValues={{ firstName: '', lastName: '', email: '', message: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                const userInfo = `First Name: ${values.firstName}\nLast Name: ${values.lastName}\nEmail: ${values.email}\nMessage: ${values.message}`;
                                toast.success(userInfo);
                                setSubmitted(true);
                                resetForm();
                            }}
                        >
                            {({isSubmitting, values}) => (
                                <Form noValidate>
                                    <GlobalField
                                        name="firstName"
                                        label="First Name"
                                        autoFocus={true}
                                    />
                                    <GlobalField
                                        name="lastName"
                                        label="Last Name"
                                    />
                                    <GlobalField
                                        name="email"
                                        type="email"
                                        label="Email Address"
                                    />
                                    <GlobalField
                                        name="message"
                                        type="textarea"
                                        label="Message"
                                        style={{justifyContent: 'start'}}
                                    />

                                    <div
                                        className="flex justify-center items-center h-full">
                                        <Button
                                            className="text-titles w-full h-14 flex justify-center items-center "
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    Sending...
                                                        <Player
                                                            autoplay
                                                            loop
                                                            src={loadingAnimation}
                                                            className="size-6"
                                                        />
                                                </>
                                            ) : (
                                                <>
                                                    Send
                                                    <SendHorizontal size={16}  className={`ml-2`}/>
                                                </>
                                            )}

                                        </Button>
                                    </div>

                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <div className="animate-fadeIn">
                            <h2 className="title">Thank you!</h2>
                            <p className="title" style={{fontSize: "26px" }}>We appreciate you contacting us. We will get back to you soon!</p>
                        </div>
                    )}
                </Card>
                <ToastContainer/>
            </>

    );
};

export default ContactForm;