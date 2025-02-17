import React from 'react';
import { Formik, Form } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from './RegisterForm';
import PasswordRequirements from './PasswordRequirements';
import { registerSchema } from './RegisterSchema';
import Card from '../../Common/Card/Card';
import { usePasswordStatus } from "../../../Hooks/User/usePasswordStatus";
import { useAuthContext } from "../../../context/AuthContext";
import GoogleSignInBtn from "../../Common/GoogleSignInBtn/GoogleSignInBtn";

const Register = () => {
    const { register, signInWithGoogle } = useAuthContext();
    const { passwordStatus, validatePassword } = usePasswordStatus();

    const initialValues = {
        businessName: '',
        contactName: '',
        phone: '',
        email: '',
        password: '',
        repeatPassword: '',
    };

    return (
        <Card className="max-w-7xl min-w-[360px] mx-auto py-8 px-4">
            <h3 className="title text-4xl text-titles mb-8">Let's create an account</h3>

            <div className="mb-8">
                <GoogleSignInBtn onClick={signInWithGoogle} />
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray"></div>
                    <span className="px-4 text-gray">or</span>
                    <div className="flex-1 border-t border-gray"></div>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={registerSchema}
                onSubmit={register}
            >
                {({isSubmitting, handleChange}) => (
                    <Form className="w-full" noValidate>
                        <RegisterForm
                            handleChange={handleChange}
                            validatePassword={validatePassword}
                            isSubmitting={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>

            <PasswordRequirements passwordStatus={passwordStatus}/>
        </Card>
    );
};

export default Register;
