import React from 'react';
import { Formik, Form } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from './RegisterForm';
import PasswordRequirements from './PasswordRequirements';
import { registerSchema } from './RegisterSchema';
import Card from '../../Common/Card/Card';
import {usePasswordStatus} from "../../../Hooks/User/usePasswordStatus";
import {useAuthContext} from "../../../contexts/AuthContext";

const Register = () => {
    const { register } = useAuthContext();
    const { passwordStatus, validatePassword } = usePasswordStatus();

    return (
        <>
            <Card className="max-w-7xl min-w-[360px] mx-auto py-8 px-4">
                <h3 className="title text-4xl text-titles mb-8">Let's create an account</h3>
                <Formik
                    initialValues={{
                        businessName: '',
                        contactName: '',
                        phone: '',
                        email: '',
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
