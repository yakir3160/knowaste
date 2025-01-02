import React, {useEffect, useState} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import {REQUIRED_MSG} from "../../constants/Constants";
import {MailCheck, SendHorizontal} from "lucide-react";
import {Player} from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../../animations/AnimationLoading.json";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

const sendContactEmail = async (values,resetForm) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/email/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (response.ok) {
            {
                setSubmitted(true);
                resetForm();
                toast.success(data.message);
            }
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        toast.error('Error sending email');
    }
}
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
    useEffect(() => {
        setTimeout(
            () => {
                setSubmitted(false);
            },
            7000
        )
    }, [submitted]);

    return (
            <>
                <Card className="min-w-[360px]">
                    <h3 className="text-titles text-4xl p-4 text-center">Contact us</h3>
                    {!submitted ? (
                        <Formik
                            initialValues={{ firstName: '', lastName: '', email: '', message: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                sendContactEmail(values, resetForm);
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
                        <Card className="p-6 text-center text-green">
                            <MailCheck className="h-12 w-12 mx-auto animate-fadeIn"/>
                            <h2 className="text-3xl font-bold  mb-4">Thank you!</h2>
                            <div className="text-center text-green text-xl font-semibold">
                            <h3>We appreciate you contacting us.</h3>
                            <h3>One of our colleagues will get back in touch with you soon!</h3>
                            </div>
                        </Card>

                    )}
                </Card>
                <ToastContainer/>
            </>

    );
};

export default ContactForm;