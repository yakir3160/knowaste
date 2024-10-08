import React, {useEffect, useState, useRef} from 'react';
import { Formik, Form } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from './RegisterForm';
import PasswordRequirements from './PasswordRequirements';
import { validationSchema } from './ValidationSchema';
import { fetchCities } from './RegisterUtils';
import Card from '../../Common/Card/Card';

const Register = () => {
    const [cities, setCities] = useState(['Select a city']);
    const [isLoading, setIsLoading] = useState(true);
    const requestInProgress = useRef(false);
    const [passwordStatus, setPasswordStatus] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        const loadCities = async () => {
            if (requestInProgress.current) return;
            try {
                requestInProgress.current = true;
                setIsLoading(true);
                await fetchCities(setCities);
            } catch (error) {
                toast.error('Failed to load cities. Please try again later.');
                console.error('Error loading cities:', error);
            } finally {
                setIsLoading(false);
                requestInProgress.current = false;
            }
        };

        loadCities();

        return () => {
            requestInProgress.current = false;
        };
    }, []);

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

    if (isLoading) {
        return (
            <Card className="max-w-7xl min-w-[360px] mx-auto py-8 px-4">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Card>
        );
    }

    return (
        <>
            <ToastContainer/>
            <Card className="max-w-7xl min-w-[360px] mx-auto py-8 px-4">
                <h3 className="title text-4xl text-titles mb-8">Let's create an account</h3>
                <Formik
                    initialValues={{
                        businessName: '',
                        contactName: '',
                        phone: '',
                        address: '',
                        city: '',
                        zipCode: '',
                        accountType: '',
                        email: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting, handleChange}) => (
                        <Form className="w-full" noValidate>
                            <RegisterForm
                                cities={cities}
                                handleChange={handleChange}
                                setPasswordStatus={setPasswordStatus}
                                isSubmitting={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
            <PasswordRequirements passwordStatus={passwordStatus}/>
        </>
    );
};

export default Register;