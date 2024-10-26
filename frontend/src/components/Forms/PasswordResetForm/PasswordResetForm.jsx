import React, { useEffect, useState } from "react";
import Card from "../../Common/Card/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validationSchema } from "../Register/ValidationSchema";
import { Form, Formik } from 'formik';
import GlobalField from "../../Common/inputs/GlobalField";
import Button from "../../Common/Button/Button";
import { usePasswordStatus } from "../Register/Hooks/usePasswordStatus";
import PasswordRequirements from "../Register/PasswordRequirements";
import { verifyPasswordResetCode, checkActionCode } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import {usePasswordReset} from "../../../globalHooks/Auth/usePasswordReset";

// TODO: Address the bug that causes password reset from our custom file to not work

const PasswordResetForm = () => {
    const { passwordStatus, validatePassword } = usePasswordStatus();
    const {handlePasswordReset} = usePasswordReset();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Initialize loading to true
    const actionCode = searchParams.get('oobCode');

    useEffect(() => {
        const verifyActionCode = async () => {
          !actionCode && navigate('/auth');

            try {
                setLoading(true);
                // בודק האם הקוד בתוקף ותקין - כלומר לא פג ולא נוצל
                await checkActionCode(auth, actionCode);
                // מאמת את הקוד ומחזיר את המייל של המשתמש
                await verifyPasswordResetCode(auth, actionCode);
            } catch (error) {
                console.error(error);
                navigate('/auth',{
                    state: {message: 'The reset link is invalid or expired. Please request a new one.'}
                });
            } finally {
                setLoading(false);
            }
        };
        verifyActionCode();
    }, [actionCode, navigate]);

    return (
        <>
            {loading ? (
                <div className={`text-3xl text-titles animate-pulse`}>Verifying reset code...</div>
            ) : (
                <>
                    <Card className={``}>
                        <Formik
                            initialValues={{
                                password: '',
                                repeatPassword: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                console.log('submitting',values);}}
                        >
                            {({ isSubmitting, handleChange }) => (
                                <Form className={`p-4`} noValidate>
                                    <h3 className={`text-titles text-3xl p-5 text-center`}>Password Reset</h3>
                                    <div className={`mb-3`}>
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
                                        className={`w-full text-titles border-2 border-lime flex justify-center items-center`}
                                        type="submit"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                Updating password...
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
                                            </>
                                        ) : (
                                            'Update password'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                    <PasswordRequirements passwordStatus={passwordStatus} />
                </>
            )}
        </>
    );
}

export default PasswordResetForm;
