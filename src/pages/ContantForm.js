import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/ContantForm.css";
import Card from "../components/Card";
import Button from "../components/Button";
import GlobalField from "../components/GlobalField";
import {REQUIRED_MSG} from "../constants";

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
                <Card className="max-w-[100rem]  mx-auto ">
                    <h3 className="title">Contact us</h3>
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
                            {({ errors, touched }) => (
                                <Form  noValidate>
                                    <GlobalField
                                        name="firstName"
                                        legend="First Name"
                                        placeholder="First name"
                                    />
                                    <GlobalField
                                        name="lastName"
                                        legend="Last Name"
                                        placeholder="Last name"
                                    />
                                    <GlobalField
                                        name="email"
                                        type="email"
                                        legend="Email Address"
                                        placeholder="Email"
                                    />
                                    <GlobalField
                                        name="message"
                                        as="textarea"
                                        legend="Message"
                                        placeholder="Enter your question or message"
                                        style={{justifyContent:'start' }}
                                    />
                                    <Button style={{ width: '100%',height:"7vh" }} className="text-titles mt-2 " type="submit">Submit</Button>

                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <div className="thank-you-message">
                            <h2 className="title">Thank you!</h2>
                            <p className="title" style={{ fontSize: "26px" }}>We appreciate you contacting us. We will get back to you soon!</p>
                        </div>
                    )}
                </Card>
                <ToastContainer/>
            </>

    );
};

export default ContactForm;