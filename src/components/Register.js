import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "./Card";
import Button from "./Button";
import GlobalField from "./GlobalField";
import { REQUIRED_MSG } from "../constants";

const Register = () => {

    useEffect(() => {

    }, []);

    const validationSchema = Yup.object().shape({
        businessName: Yup.string().required(REQUIRED_MSG),
        contactName: Yup.string().required(REQUIRED_MSG),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number is not valid')
            .required(REQUIRED_MSG),
        address: Yup.string().required(REQUIRED_MSG),
        city: Yup.string().required(REQUIRED_MSG),
        accountType: Yup.string().required(REQUIRED_MSG),
        email: Yup.string()
            .email('Invalid email address')
            .required(REQUIRED_MSG),
        password: Yup.string().required(REQUIRED_MSG),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required(REQUIRED_MSG),
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
        <>
            <ToastContainer />
            <Card className="max-w-2xl min-w-[360px] mx-auto py-8 px-4">
                <h3 className="title text-4xl text-titles mb-8">Let's create an account</h3>
                <Formik
                    initialValues={{
                        businessName: '',
                        contactName: '',
                        phone: '',
                        address: '',
                        city: '',
                        accountType: '',
                        email: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="w-full" noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                <div
                                    className="col-span-1 sm:col-span-2 lg:col-span-2 flex justify-center items-center h-full">
                                    <Button className="text-titles w-full h-16" type="submit">Submit</Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </>
    );
}

export default Register;
