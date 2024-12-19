import React from 'react';
import { Formik, Form } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from './RegisterForm';
import PasswordRequirements from './PasswordRequirements';
import { registerSchema } from './RegisterSchema';
import Card from '../../Common/Card/Card';
import {useCities} from "./Hooks/useCities";
import {usePasswordStatus} from "./Hooks/usePasswordStatus";
import {useAuthContext} from "../../../contexts/AuthContext";

const Register = () => {
    const { cities, isLoading } = useCities("Select City");
    const { register } = useAuthContext();
    const { passwordStatus, validatePassword } = usePasswordStatus();

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
                        kosher: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    validationSchema={registerSchema}
                    onSubmit={register}
                >
                    {({isSubmitting, handleChange}) => (
                        <Form className="w-full" noValidate>
                            {isSubmitting}
                            <RegisterForm
                                cities={cities}
                                handleChange={handleChange}
                                validatePassword={validatePassword}
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