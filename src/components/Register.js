import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/Register.css";
import featuredImage from "../img/Mobile login-pana 2.png";
import { countries } from 'countries-list';
import Card from "./Card";

const Register = () => {
    const [countryOptions, setCountryOptions] = useState([]);

    useEffect(() => {
        const options = Object.entries(countries).map(([code, { name }]) => ({
            value: code,
            label: name
        }));
        setCountryOptions(options);
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
            <Card style={{minWidth:'50vh'}} >
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
                            <Form className="flex flex-col gap-6" noValidate>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-cols-max">
                                    <div className="input-container">
                                        <label htmlFor="businessName" className="block text-sm font-medium">Business
                                            Name</label>
                                        <Field
                                            className={`input ${errors.businessName && touched.businessName ? 'error-reg' : ''}`}
                                            id="businessName" name="businessName" placeholder="Business name"/>
                                        <div className="error-container">
                                            <ErrorMessage name="businessName" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="contactName" className="block text-sm font-medium">Contact
                                            Representative</label>
                                        <Field
                                            className={`input ${errors.contactName && touched.contactName ? 'error-reg' : ''}`}
                                            id="contactName" name="contactName" placeholder="Contact representative"/>
                                        <div className="error-container">
                                            <ErrorMessage name="contactName" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="input-container">
                                        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                                        <Field className={`input ${errors.phone && touched.phone ? 'error-reg' : ''}`}
                                               id="phone" name="phone" placeholder="05x-xxxxxxx"/>
                                        <div className="error-container">
                                            <ErrorMessage name="phone" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="address" className="block text-sm font-medium">Address</label>
                                        <Field
                                            className={`input ${errors.address && touched.address ? 'error-reg' : ''}`}
                                            id="address" name="address" placeholder="Address"/>
                                        <div className="error-container">
                                            <ErrorMessage name="address" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="input-container">
                                        <label htmlFor="city" className="block text-sm font-medium">City</label>
                                        <Field className={`input ${errors.city && touched.city ? 'error-reg' : ''}`}
                                               id="city" name="city" placeholder="City"/>
                                        <div className="error-container">
                                            <ErrorMessage name="city" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="country" className="block text-sm font-medium">Country</label>
                                        <Field as="select" id="country" name="country"
                                               className={`input ${errors.country && touched.country ? 'error-reg' : ''}`}>
                                            <option value="">Select a Country</option>
                                            {countryOptions.map((country) => (
                                                <option key={country.value} value={country.value}>
                                                    {country.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <div className="error-container">
                                            <ErrorMessage name="country" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="input-container">
                                        <label htmlFor="accountType" className="block text-sm font-medium">Account
                                            Type</label>
                                        <Field as="select" id="accountType" name="accountType"
                                               className={`input ${errors.accountType && touched.accountType ? 'error-reg' : ''}`}>
                                            <option value="">Select Account Type</option>
                                            <option value="restaurant-manager">Restaurant Manager</option>
                                            <option value="supplier">Supplier</option>
                                        </Field>
                                        <div className="error-container">
                                            <ErrorMessage name="accountType" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                        <Field id="email" name="email"
                                               className={`input ${errors.email && touched.email ? 'error-reg' : ''}`}
                                               type="email" placeholder="email@domain.com"/>
                                        <div className="error-container">
                                            <ErrorMessage name="email" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="input-container">
                                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                        <Field id="password" name="password"
                                               className={`input ${errors.password && touched.password ? 'error-reg' : ''}`}
                                               type="password" placeholder="Password"/>
                                        <div className="error-container">
                                            <ErrorMessage name="password" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="repeatPassword" className="block text-sm font-medium">Repeat
                                            Password</label>
                                        <Field id="repeatPassword" name="repeatPassword"
                                               className={`input ${errors.repeatPassword && touched.repeatPassword ? 'error-reg' : ''}`}
                                               type="password" placeholder="Repeat Password"/>
                                        <div className="error-container">
                                            <ErrorMessage name="repeatPassword" component="div" className="error-reg"/>
                                        </div>
                                    </div>
                                </div>
                                <button className="submit bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                                        type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </Form>
                        )}
                    </Formik>
            </Card>
            <div style={{width: "50%"}}>
                <img src={featuredImage} alt=""/>
            </div>
        </section>
    );
}

export default Register;