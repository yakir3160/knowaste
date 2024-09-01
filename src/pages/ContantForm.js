import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/ContantForm.css";
import featuredImage from '../img/contact.png';

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
                <div className="card" style={{maxWidth:"40vh"}}>
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
                                    <div className="input-container">
                                        <Field
                                            className={`input ${errors.firstName && touched.firstName ? 'error' : ''}`}
                                            name="firstName"
                                            placeholder="First name"
                                        />
                                        <div className="error-container">
                                            <ErrorMessage name="firstName" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <Field
                                            className={`input ${errors.lastName && touched.lastName ? 'error' : ''}`}
                                            name="lastName"
                                            placeholder="Last name"
                                        />
                                        <div className="error-container">
                                            <ErrorMessage name="lastName" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <Field
                                            className={`input ${errors.email && touched.email ? 'error' : ''}`}
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                        />
                                        <div className="error-container">
                                            <ErrorMessage name="email" component="div" className="error" />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <Field
                                            as="textarea"
                                            className={`input-message ${errors.message && touched.message ? 'error' : ''}`}
                                            name="message"
                                            placeholder="Enter your question or message"
                                        />
                                        <div className="error-container">
                                            <ErrorMessage name="message" component="div" className="error" />
                                        </div>
                                    </div>
                                    <button className="submit" type="submit">Submit</button>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <div className="thank-you-message">
                            <h2 className="title">Thank you!</h2>
                            <p className="title" style={{ fontSize: "28px" }}>We appreciate you contacting us. We will get back to you soon!</p>
                        </div>
                    )}
                </div>
                <div style={{maxWidth: "40vh", marginRight: "-8%"}}>
                    <img className="card-img" src={featuredImage} alt="Contact"/>
                </div>
                <ToastContainer/>
            </section>

    );
};

export default ContactForm;