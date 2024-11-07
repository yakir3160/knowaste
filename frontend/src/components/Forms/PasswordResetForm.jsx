import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { checkActionCode } from "firebase/auth";

// Components
import Card from "../Common/Card/Card";
import GlobalField from "../Common/inputs/GlobalField";
import Button from "../Common/Button/Button";
import PasswordRequirements from "./Register/PasswordRequirements";

// Custom Hooks
import { usePasswordStatus } from "./Register/Hooks/usePasswordStatus";
import { usePasswordReset } from "../../Hooks/Auth/usePasswordReset";

// Firebase Config
import { auth } from "../../firebaseConfig";

// Validation Schemas
import { passwordSchema, repeatPasswordSchema } from "../../schemas/passwordSchema";

const validationSchema = Yup.object().shape({
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
});

const initialValues = {
    password: '',
    repeatPassword: '',
};

const PasswordResetForm = () => {
    const { passwordStatus, validatePassword } = usePasswordStatus();
    const { handlePasswordReset } = usePasswordReset();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const actionCode = searchParams.get('oobCode');

    useEffect(() => {
        const verifyActionCode = async () => {
            if (!actionCode) {
                return navigate('/auth');
            }

            try {
                setLoading(true);
                await checkActionCode(auth, actionCode);
            } catch (error) {
                console.error(error);
                navigate('/auth', {
                    state: {
                        message: 'The reset link is invalid or expired. Please request a new one.'
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        verifyActionCode();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        await handlePasswordReset(values, actionCode);
        setSubmitting(false);
    };

    if (loading) {
        return <div className="text-3xl text-titles animate-pulse">Verifying reset code...</div>;
    }

    return (
        <>
            <Card>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleChange }) => (
                        <Form className="p-4" noValidate>
                            <h3 className="text-titles text-3xl p-5 text-center">Password Reset</h3>

                            <div className="mb-3">
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
                                    legend="Password confirmation"
                                    type="password"
                                />
                            </div>

                            <Button
                                className="w-full text-titles border-2 border-lime flex justify-center items-center"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        Resetting password...
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3" />
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
            <PasswordRequirements passwordStatus={passwordStatus} />
        </>
    );
};

export default PasswordResetForm;