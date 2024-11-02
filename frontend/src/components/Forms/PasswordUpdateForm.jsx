import React, {useEffect} from 'react';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import { CheckCircle } from "lucide-react";
import Card from "../Common/Card/Card";
import Button from "../Common/Button/Button";
import GlobalField from "../Common/inputs/GlobalField";
import { usePasswordReset } from "../../Hooks/Auth/usePasswordReset";
import PasswordRequirements from "./Register/PasswordRequirements";
import { usePasswordStatus } from "./Register/Hooks/usePasswordStatus";
import { passwordSchema, repeatPasswordSchema } from "../../schemas/passwordSchema";
import { REQUIRED_MSG } from "../../constants/Constants";

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(REQUIRED_MSG),
    password: passwordSchema.test(
        'not-same-as-current',
        'New password must be different from current password',
        function(value) {
            return value !== this.parent.currentPassword;
        }
    ),
    repeatPassword: repeatPasswordSchema,
});

const initialValues = {
    currentPassword: '',
    password: '',
    repeatPassword: '',
};

const PasswordUpdateForm = () => {
    const { updatePasswordWithVerification, error, success, setSuccess } = usePasswordReset();
    const { passwordStatus, validatePassword } = usePasswordStatus();

    useEffect(() => {
        const timer = success ? setTimeout(() => setSuccess(false), 5000) : null;
        return () => timer && clearTimeout(timer);
    }, [success, setSuccess]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        await updatePasswordWithVerification(values.currentPassword, values.password);
        setSubmitting(false);
        if (!success) {
            resetForm();
        }
    };

    const renderButton = (isSubmitting) => {
        if (isSubmitting) {
            return <Button
                className="w-full border-2 border-lime flex flex-row justify-center">
                Updating Password...
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
            </Button>;
        }
        if (success) {
            return (
                <Button
                    className="w-full bg-green border-2 border-white text-white flex flex-row justify-center hover:text-white"
                    type="submit"
                    disabled
                >
                    Password Updated
                    <CheckCircle className="size-5 ml-2"/>
                </Button>
            );
        }

        return (
            <Button
                className="w-full border-2 border-lime"
                type="submit"
            >
                Change Password
            </Button>
        );
    };

    return (
        <>
            <Card className="w-full">
                <h3 className="text-titles text-3xl p-3 text-center">Password Update</h3>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values, isSubmitting }) => (
                        <Form className="grid grid-cols-1 gap-4 h-fit relative" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <GlobalField
                                    name="currentPassword"
                                    legend="Current Password"
                                    type="password"
                                    value={values.currentPassword}
                                    onChange={handleChange}
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
                            </div>
                            {error && <div className="text-errorRed text-center ">{error}</div>}
                            <div className="mt-6">
                                {renderButton(isSubmitting)}

                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
            <div className="col-span-full">
                <PasswordRequirements passwordStatus={passwordStatus} />
            </div>
        </>
    );
};

export default PasswordUpdateForm;