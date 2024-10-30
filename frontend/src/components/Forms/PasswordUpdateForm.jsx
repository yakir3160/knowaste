import React from 'react';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import { usePasswordReset } from "../../Hooks/Auth/usePasswordReset";
import PasswordRequirements from "./Register/PasswordRequirements";
import { usePasswordStatus } from "./Register/Hooks/usePasswordStatus";
import {passwordSchema, repeatPasswordSchema} from "../../schemas/passwordSchema";

// הודעת שגיאה עבור סיסמה
const PASSWORD_MSG = 'Password must meet the conditions';
const REQUIRED_MSG = 'This field is required';


const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required(REQUIRED_MSG),
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
});

const PasswordUpdateForm = () => {
    const { updatePasswordWithVerification, error } = usePasswordReset();
    const { passwordStatus, validatePassword } = usePasswordStatus();

    return (
        <>
            <Card className="w-full">
                <h3 className="text-titles text-3xl p-3 text-center">Password Update</h3>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        currentPassword: '',
                        password: '',
                        repeatPassword: '',
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        await updatePasswordWithVerification(values.currentPassword, values.password);
                        setSubmitting(false);

                    }}
                >
                    {({ handleChange, handleSubmit, values }) => (
                        <Form
                            className="grid grid-cols-1 gap-4 h-fit"
                            onSubmit={handleSubmit}
                        >
                            <GlobalField
                                name="currentPassword"
                                legend="Current Password"
                                type="password"
                                value={values.currentPassword}
                                onChange={(e) => {
                                    handleChange(e);
                                    validatePassword(e.target.value);
                                }}
                            />
                            <GlobalField
                                name="password"
                                legend="New Password"
                                type="password"
                                value={values.password}
                                onChange={(e) => {
                                    handleChange(e);
                                    validatePassword(e.target.value);
                                }}
                            />
                            <GlobalField
                                name="repeatPassword"
                                legend="Repeat Password"
                                type="password"
                                value={values.repeatPassword}
                                onChange={handleChange}
                            />
                            <Button
                                className="h-fit border-2 border-lime self-center"
                                type="submit"
                            >
                                Change Password
                            </Button>
                            {error && <div className="text-errorRed text-center">{error}</div>}
                        </Form>
                    )}
                </Formik>
            </Card>
            <div className={`col-span-full`}>
                <PasswordRequirements passwordStatus={passwordStatus} />
            </div>
        </>
    );
};

export default PasswordUpdateForm;
