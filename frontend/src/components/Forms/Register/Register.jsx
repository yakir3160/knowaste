import React, {useEffect, useState, useRef} from 'react';
import { Formik, Form } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';
import RegisterForm from './RegisterForm';
import PasswordRequirements from './PasswordRequirements';
import { validationSchema } from './ValidationSchema';
import { fetchCities } from './RegisterUtils';
import Card from '../../Common/Card/Card';
import {auth,db} from '../../../firebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


const Register = () => {
    const navigate = useNavigate();
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


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            // הכנת אובייקט המידע למשתמש - ללא הסיסמה
            const userData = {
                businessName: values.businessName,
                contactName: values.contactName,
                phone: values.phone,
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                accountType: values.accountType,
                email: values.email,
                uid: userCredential.user.uid  // שמירת ה-ID של המשתמש מ-Firebase Auth
            };
            console.log('Attempting to create user document in Firestore');
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            console.log('User document created successfully');
            toast.success('Registration successful!');
            navigate('/admin-panel')
            resetForm();

        } catch (error) {
            error.code === 'auth/email-already-in-use'
                ? navigate('/auth', {
                    state: {
                        showRegister: false,
                        email: values.email
                    }
                })
                : (() => {
                    toast.error('Registration failed. Please try again.');
                    console.error('Error during registration:', error);
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                })();

        } finally {
            setSubmitting(false);
        }
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