import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/ContantForm.css";
import featuredImage from '../img/contact.png';

const ContactForm = () => {
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
        <div className="contact-form">
            <section className="contact-form-inner">
                <div className="card">
                    <h3 className="title">Contact us</h3>
                    <Formik
                        initialValues={{ firstName: '', lastName: '', email: '', message: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            const userInfo = `First Name: ${values.firstName}\nLast Name: ${values.lastName}\nEmail: ${values.email}\nMessage: ${values.message}`;
                            console.log(userInfo)
                            toast.success(userInfo);
                            resetForm();
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form style={{ width: '100%',display:"flex",flexDirection:"column",alignItems:"center" ,justifyContent:"center"}} noValidate>
                                <div className= "input-container">
                                    <Field
                                        className={`input ${errors.firstName && touched.firstName ? 'error' : ''}`}
                                        name="firstName"
                                        placeholder="First name"
                                    />
                                    <ErrorMessage name="firstName" component="div" className="error" />
                                </div>
                                <div className= "input-container">
                                    <Field
                                        className={`input ${errors.lastName && touched.lastName ? 'error' : ''}`}
                                        name="lastName"
                                        placeholder="Last name"
                                    />
                                    <ErrorMessage name="lastName" component="div" className="error" />
                                </div>
                                <div className= "input-container">
                                    <Field
                                        className={`input ${errors.email && touched.email ? 'error' : ''}`}
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                    />
                                    <ErrorMessage name="email" component="div" className="error" />
                                </div>
                                <div className= "input-container">
                                    <Field
                                        as="textarea"
                                        className={`input-message ${errors.message && touched.message ? 'error' : ''}`}
                                        name="message"
                                        placeholder="Enter your question or message"
                                    />
                                    <ErrorMessage name="message" component="div" className="error" />
                                </div>
                                <button className="submit" type="submit">Submit</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="card">
                    <img className="card-img-contact" src={featuredImage} alt="" />
                </div>
            </section>
            <ToastContainer />
        </div>
    );
};

export default ContactForm;
