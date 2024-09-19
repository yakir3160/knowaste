import React, {useEffect, useState} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "./Card";
import Button from "./Button";
import GlobalField from "./GlobalField";
import { REQUIRED_MSG } from "../constants/constants";

const Register = () => {
    const [cities, setCities] = useState([]);


    useEffect(() =>{
        const fetchCities = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/royts/israel-cities/master/israel-cities.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const cityNames = data.map(city => city.english_name)
                    .filter(name => name && name.trim() !== " ")
                    .map(name => name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                    )
                    .sort();
                setCities(['Select a city', ...cityNames]);
                cities.forEach(city => {
                    console.log(city)})
            } catch (err) {
                console.error('Error fetching cities:', err);
            }
        };
        fetchCities().then(r => {});
    },[])
    const [passwordStatus, setPasswordStatus] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    const PASSWORD_MSG = 'Password must meet the conditions';


    const validationSchema = Yup.object().shape({
        businessName: Yup.string().required(REQUIRED_MSG),
        contactName: Yup.string().required(REQUIRED_MSG),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number is not valid')
            .required(REQUIRED_MSG),
        address: Yup.string().required(REQUIRED_MSG),
        city: Yup.string().required(REQUIRED_MSG),
        zipCode: Yup.string().optional(),
        accountType: Yup.string().required(REQUIRED_MSG),
        email: Yup.string()
            .email('Invalid email address')
            .required(REQUIRED_MSG),
        password: Yup.string()
            .min(8, PASSWORD_MSG)
            .matches(/[A-Z]/, PASSWORD_MSG)
            .matches(/[a-z]/, PASSWORD_MSG)
            .matches(/[0-9]/, PASSWORD_MSG)
            .matches(/[@$!%*?&]/, PASSWORD_MSG)
            .required(REQUIRED_MSG),
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
                ZIP: ${values.zipCode}
                City: ${values.city}
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

    const validatePassword = (value) => {
        const lengthValid = value.length >= 8;
        const uppercaseValid = /[A-Z]/.test(value);
        const lowercaseValid = /[a-z]/.test(value);
        const numberValid = /[0-9]/.test(value);
        const specialCharValid = /[@$!%*?&]/.test(value);

        setPasswordStatus({
            length: lengthValid,
            uppercase: uppercaseValid,
            lowercase: lowercaseValid,
            number: numberValid,
            specialChar: specialCharValid
        });

        return value;
    };

    return (

        <>

            <ToastContainer />
            <Card className="max-w-7xl min-w-[360px] mx-auto py-8 px-4">
                <h3 className="title text-4xl text-titles mb-8">Let's create an account</h3>
                <Formik
                    initialValues={{
                        businessName: '',
                        contactName: '',
                        phone: '',
                        address: '',
                        city: '',
                        zipCode:'',
                        accountType: '',
                        email: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, values, handleChange }) => (
                        <Form className="w-full" noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <GlobalField
                                    name="businessName"
                                    legend="Business Name"
                                    type="text"
                                />
                                <GlobalField
                                    name="contactName"
                                    legend="Contact Name"
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
                                    type="email"
                                />
                                <GlobalField
                                    name="address"
                                    legend="Address"
                                    type="text"
                                />
                                <GlobalField
                                    name="city"
                                    options={cities.map((city) => ({ value: city, label: city}))}

                                    as="select"
                                />
                                <GlobalField
                                    name="zipCode"
                                    legend="Zip"
                                    type="text"
                                />
                                <GlobalField
                                    name="accountType"
                                    as="select"
                                    options={[
                                        { value: '', label: 'Account Type' },
                                        { value: 'restaurant-manager', label: 'Restaurant Manager' },
                                        { value: 'supplier', label: 'Supplier' }
                                    ]}
                                />
                                <GlobalField
                                    name="password"
                                    legend="Password"
                                    type="password"
                                    onChange={(e) => {
                                        handleChange(e);
                                        validatePassword(e.target.value);
                                    }}
                                />
                                <GlobalField
                                    name="repeatPassword"
                                    legend="Repeat Password"
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
            <div className="max-w-lg mx-auto mt-8 ">
                <p className="text-lg font-semibold">Password Requirements:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm lg:text-lg font-semibold">
                    <li className={passwordStatus.length ? 'text-green-600 ' : ''}>

                        Password must be at least 8 characters long
                    </li>
                    <li className={passwordStatus.uppercase ? 'text-green-600 font-semibold' : ''}>
                        Contains at least one uppercase letter
                    </li>
                    <li className={passwordStatus.lowercase ? 'text-green-600 font-semibold' : ''}>
                        Contains at least one lowercase letter
                    </li>
                    <li className={passwordStatus.number ? 'text-green-600 font-semibold' : ''}>
                        Contains at least one number
                    </li>
                    <li className={passwordStatus.specialChar ? 'text-green-600 font-semibold ' : ''}>
                        Contains at least one special character (@$!%*?&)
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Register;
