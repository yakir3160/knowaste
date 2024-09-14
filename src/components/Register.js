import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/Register.css";
import featuredImage from "../img/Mobile login-pana 2.png";
import { countries } from 'countries-list';
import Card from "./Card";
import Button from "./Button";
import GlobalField from "./GlobalField";

const Register = () => {

    useEffect(() => {

    }, []);

    const validationSchema = Yup.object().shape({
        businessName: Yup.string().required('Business name is required'),
        contactName: Yup.string().required('Contact representative is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number is not valid')
            .required('Phone is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        accountType: Yup.string().required('Account type is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Repeat password is required'),
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            const userInfo = `
                Business Name: ${values.businessName}
                Contact Name: ${values.contactName}
                Phone: ${values.phone}
                Address: ${values.address}
                City: ${values.city}
                Country: ${values.country}
                Account Type: ${values.accountType}
                Email: ${values.email}
            `;
            toast.success(userInfo, {
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
        <section className="contact-form-inner">
            <ToastContainer />
            <Card style={{minWidth:'50vh',width:"80%",height:"fit-content"}} >
                <h3 className="title">Let's create an account</h3>
                <Formik
                    initialValues={{
                        businessName: '',
                        contactName: '',
                        phone: '',
                        address: '',
                        city: '',
                        country: '',
                        accountType: '',
                        email: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched, isSubmitting}) => (
                        <Form className="flex flex-col gap-6 w-full" noValidate>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <GlobalField
                                    name="businessName"
                                    legend="Business Name"
                                    placeholder="Business Name"
                                    type="text"
                                />
                                <GlobalField
                                    name="contactName"
                                    legend="Contact Name"
                                    placeholder="Contact Name"
                                    type="text"
                                />
                                <GlobalField
                                    name="phone"
                                    legend="Phone"
                                    type="tel"
                                />
                                <GlobalField
                                    name="email"
                                    legend="Email"
                                    placeholder="Email"
                                    type="email"
                                />
                                <GlobalField
                                    name="address"
                                    legend="Address"
                                    placeholder="Address"
                                    type="text"
                                />
                                <GlobalField
                                    name="city"
                                    legend="City"
                                    placeholder="City"
                                    options={[
                                        {value: '', label: 'Select City'},
                                        {value: 'restaurant-manager', label: 'Restaurant Manager'},
                                        {value: 'supplier', label: 'Supplier'}
                                    ]}
                                    as="select"
                                />
                                <GlobalField
                                    name="zipCode"
                                    legend="Zip"
                                    placeholder="Zip Code"
                                    type="text"
                                />
                                <GlobalField
                                    name="accountType"
                                    legend="Account Type"
                                    placeholder="Account Type"
                                    as="select"
                                    options={[
                                        {value: '', label: 'Select Account Type'},
                                        {value: 'restaurant-manager', label: 'Restaurant Manager'},
                                        {value: 'supplier', label: 'Supplier'}
                                    ]}
                                />
                                <GlobalField
                                    name="password"
                                    legend="Password"
                                    placeholder="Password"
                                    type="password"
                                />
                                <GlobalField
                                    name="repeatPassword"
                                    legend="Repeat Password"
                                    placeholder="Repeat Password"
                                    type="password"
                                />
                                <div className="col-span-2 flex justify-center items-center h-full ">
                                    <Button className="text-titles w-full h-16" type="submit">Submit</Button>
                                </div>
                            </div>


                        </Form>
                    )}
                </Formik>
            </Card>
        </section>
    );
}

export default Register;