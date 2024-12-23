import React, {} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Pencil, Save, CircleX } from 'lucide-react';
import Card from "../../Common/Card/Card";
import Button from "../../Common/Button/Button";
import GlobalField from "../../Common/inputs/GlobalField";
import { useUserContext } from "../../../contexts/UserContext";



const validationSchema = Yup.object().shape({
    businessName: Yup.string().required('Required'),
    contactName: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
});
const UserDetailsForm = ({ user }) => {
    const { updateUserDetails, error } = useUserContext();
    const [editing, setEditing] = React.useState(false);



    const initialValues = {
        businessName: user?.businessName,
        contactName: user?.contactName,
        phone: user?.phone,
    };

    return (
        <Card >
            <h2 className="text-titles text-3xl p-3 text-center ">Update Details</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    if (editing) {
                        await updateUserDetails(values);
                    }
                    setEditing(false);
                    setSubmitting(false);
                    resetForm({ values });
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <div className={`border-2 border-secondary p-2 rounded-sm`}>
                        <Button
                            className="h-fit text-center border border-secondary flex flex-row justify-center mb-3"
                            type="button"
                            onClick={() => setEditing(!editing)}
                        >
                            {editing ? <CircleX size={20}/> :  <Pencil size={20} />}
                        </Button>
                        <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                            <GlobalField
                                name="businessName"
                                label="Business Name"
                                type="text"
                                value={values.businessName}
                                disabled={!editing}
                                onChange={handleChange}
                            />
                            <GlobalField
                                name="contactName"
                                label="Contact Name"
                                type="text"
                                value={values.contactName}
                                disabled={!editing}
                                onChange={handleChange}
                            />
                            <GlobalField
                                name="phone"
                                label="Phone"
                                type="tel"
                                value={values.phone}
                                disabled={!editing}
                                onChange={handleChange}
                            />

                            <div className="relative flex flex-col justify-center col-span-full">
                                    <Button
                                        className="h-12 w-full border border-lime flex flex-row justify-center items-center"
                                        type="submit"
                                        disabled={!editing}
                                    >
                                        Save
                                        <Save className="h-5 w-5 ml-2"/>
                                    </Button>
                            </div>

                            {error && (
                                <div className="text-md text-center text-errorRed h-fit">
                                    {error}
                                </div>
                            )}
                        </Form>
                    </div>
                )}
            </Formik>
        </Card>
    );
};
export default UserDetailsForm;
