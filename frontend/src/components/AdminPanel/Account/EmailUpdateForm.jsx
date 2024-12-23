import React, {useState} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Pencil, Save, CircleX } from 'lucide-react';
import Card from "../../Common/Card/Card";
import Button from "../../Common/Button/Button";
import GlobalField from "../../Common/inputs/GlobalField";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useUserContext } from "../../../contexts/UserContext";




const EmailUpdateForm = ({ user }) => {
    const { updateEmail, authError} = useAuthContext();
    const { updateUserDetails} = useUserContext();
    const [editing, setEditing] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Required'),
    });

    const handleEmailUpdate = async (newEmail) => {
        try {
            const authUpdate = await updateEmail(newEmail);
            if (authUpdate) {
                await updateUserDetails({ email: newEmail });
                setEditing(false);
            }
        } catch (err) {
            console.error("Error updating email:", err);
        }
    };

    return (
        <Card>
            <h2 className="text-titles text-3xl p-3 text-center">Update Email</h2>
            <Formik
                initialValues={{ email: user?.email || '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    if (editing) {
                        await handleEmailUpdate(values.email);
                    }
                    setSubmitting(false);
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <div className={`border-2 border-secondary p-2 rounded-sm`}>
                        <Button
                            className="h-fit text-center border border-secondary flex flex-row justify-center mb-3"
                            type="button"
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? <CircleX size={20} /> : <Pencil size={20} />}
                        </Button>
                        <Form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                            <GlobalField
                                name="email"
                                label="Email"
                                type="email"
                                value={values.email}
                                disabled={!editing}
                                onChange={handleChange}
                            />

                            <div className="relative flex flex-col justify-center">
                                    <Button
                                        className="h-12 w-full border border-lime flex flex-row justify-center items-center"
                                        type="submit"
                                        disabled={!editing}
                                    >
                                        Save
                                        <Save className="h-5 w-5 ml-2" />
                                    </Button>
                            </div>

                            {authError && (
                                <div className="text-md text-center text-errorRed h-fit">
                                    {authError}
                                </div>
                            )}
                        </Form>
                    </div>
                )}
            </Formik>
        </Card>
    );
};
export default EmailUpdateForm;