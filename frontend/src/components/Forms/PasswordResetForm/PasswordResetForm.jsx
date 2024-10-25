import React, {useEffect} from "react";
import  Card from "../../Common/Card/Card";
import {validationSchema} from "../Register/ValidationSchema";
import {Form,Formik} from 'formik';
import GlobalField from "../../Common/inputs/GlobalField";
import Button from "../../Common/Button/Button";
import {usePasswordStatus} from "../Register/Hooks/usePasswordStatus";
import PasswordRequirements from "../Register/PasswordRequirements"
import {useAuthContext} from "../../../contexts/AuthContext";

//TODO: Address the bug that causes password reset from our custom file to not work

const PasswordResetForm = () => {
    const { passwordStatus, validatePassword } = usePasswordStatus();
    const {passwordReset ,authError, clearAuthError} = useAuthContext();

    useEffect (() => {
        clearAuthError();
    },[])

    return(
        <>
            <Card className={``}>
                <Formik
                    initialValues={{
                        password:'',
                        repeatPassword:'',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={passwordReset}
                >
                    {({isSubmitting ,handleChange}) => (
                        <Form className={`p-4`} noValidate>
                            <h3 className={`text-titles text-3xl p-5 text-center`}>Password Reset</h3>
                            {authError && (
                                <div className={`text-errorRed text-center`}>{authError}</div>
                            )}
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
            <PasswordRequirements passwordStatus={passwordStatus}/>
        </>

    )
}
export default PasswordResetForm;