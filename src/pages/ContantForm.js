import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/ContantForm.css";
import featuredImage from '../img/contact.png';
import Card from "../components/Card";
import Button from "../components/Button";
import GlobalField from "../components/GlobalField";

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(/^[\u0590-\u05FFa-zA-Z\s]+$/, 'First name should contain only English or Hebrew characters and spaces')
            .required('First name is required'),
        lastName: Yup.string()
            .matches(/^[\u0590-\u05FFa-zA-Z\s]+$/, 'Last name should contain only English or Hebrew characters and spaces')
            .required('Last name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        message: Yup.string()
            .required('Message is required'),
    });

    return (
            <section className="contact-form-inner" >
                <Card style={{minWidth:"50vh",maxWidth:"50vh"}}>
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
                                <Form style={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} noValidate>
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
                                    <Button style={{ width: '100%',height:"7vh"}} className="text-titles " type="submit">Submit</Button>

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
            </section>

    );
};

export default ContactForm;