import React, {useEffect} from "react";
import  Card from "../../Common/Card/Card";
import {validationSchema} from "../Register/ValidationSchema";
import {Formik, Form,} from 'formik';
import GlobalField from "../../Common/inputs/GlobalField";
import Button from "../../Common/Button/Button";
import {useAuthContext} from "../../../contexts/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";


const PasswordResetPrompt = () => {
    const {passwordResetEmail, error,success} = useAuthContext();
    const location = useLocation();
    const emailFromLogin = location.state?.email || '';
    return(
        <Card className={``}>
            {success ? (
                <div className="text-green text-xl font-semibold text-center p-4">
                    Check your email for password reset instructions
                </div>
            ) : (
                <Formik
                    initialValues={{
                        email:emailFromLogin,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={passwordResetEmail}
                >
                    {({isSubmitting }) => (
                        <Form className={`p-4`} noValidate>
                            <h3 className={`text-titles text-3xl p-5 text-center`}>Password Reset</h3>
                            {error && (
                                <div className={`text- text-errorRed md text-center mb-4`}>
                                    {error}
                                </div>
                            )}
                            <div className={`mb-3`}>
                                <GlobalField
                                    type="email"
                                    name="email"
                                    legend="Email"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-titles flex justify-center items-center`}>
                                {isSubmitting ? (
                                    <>
                                        Sending...
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
                                    </>
                                ) : (
                                    'Send Password Reset Email'
                                )}
                            </Button>
                        </Form>
                    )}
                </Formik>
            )
            }
        </Card>

    )
}
export default PasswordResetPrompt;