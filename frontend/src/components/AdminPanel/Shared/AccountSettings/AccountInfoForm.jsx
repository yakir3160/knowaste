import React, {useEffect, useState} from 'react';
import { Formik, Form } from "formik";
import {Pencil,Save,CheckCircle} from 'lucide-react'
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import GlobalField from "../../../Common/inputs/GlobalField";
import {useUserContext} from "../../../../contexts/UserContext";

const AccountInfoForm = () => {
    const [editing,setEditing] = useState(false)
    const { userBaseData: user ,updateUserDetails,error,loading,success,setSuccess} = useUserContext();
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [success, setSuccess]);
    return (
        <Card className="w-full h-fit">
            <h3 className="text-titles text-3xl p-3 text-center">Account Info</h3>
            <Formik
                initialValues={{
                    businessName: user?.businessName,
                    contactName: user?.contactName,
                    phone: user?.phone,
                    email: user?.email,
                    address: user?.address,
                    city: user?.city,
                    zipCode: user?.zipCode,
                    kosher: user?.kosher,
                }}
                onSubmit={async (values ,{setSubmitting,resetForm}) => {
                    await updateUserDetails(values)
                    setEditing(false)
                    setSubmitting(false)
                    resetForm({ values });
                }}
            >
                {({handleChange, handleSubmit, values}) => (
                    <Form
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        onSubmit={handleSubmit}
                    >
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
                        <GlobalField
                            name="email"
                            label="Email"
                            type="email"
                            value={values.email}
                            disabled={!editing}
                            onChange={handleChange}
                        />
                        <GlobalField
                            name="address"
                            label="Address"
                            type="text"
                            value={values.address}
                            disabled={!editing}
                            onChange={handleChange}
                        />
                        <GlobalField
                            name="city"
                            label="City"
                            type="text"
                            value={values.city}
                            disabled={!editing}
                            onChange={handleChange}
                        />
                        <GlobalField
                            name="zipCode"
                            label="Zip"
                            type="text"
                            value={values.zipCode}
                            disabled={!editing}
                            onChange={handleChange}
                        />
                        <GlobalField
                            name="kosher"
                            type="select"
                            label={"Kosher"}
                            value={values.kosher}
                            disabled={!editing}
                            options={[
                                { value: true, label: 'Yes' },
                                { value: false, label: 'No' }
                            ]}
                        />

                            <Button className={`h-fit text-center  border-2 border-secondary  flex flex-row justify-center`} type={"button"} onClick={() => {setEditing(!editing)}}>
                                Edit
                                <Pencil className={`size-5 ml-2`}/>
                            </Button>
                            {loading ? (
                                <Button
                                    className="h-fit border-2 border-lime flex flex-row justify-center transform transition-all duration-300"
                                    type="submit"
                                >
                                    Saving...
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
                                </Button>
                            ) : success ? (
                                <Button
                                    className="h-fit bg-green border-2 border-white  text-white  hover:text-white flex flex-row justify-center"
                                    type="submit"
                                    disabled={true}
                                >
                                    Saved!
                                    <CheckCircle className={`size-5 ml-2`}/>
                                </Button>
                            ) : (
                                <Button
                                    className="h-fit border-2 border-lime self-center flex flex-row justify-center"
                                    type="submit"
                                >
                                    Save
                                    <Save className={`size-5 ml-2`}/>
                                </Button>
                            )}

                        {error && (
                            <div className="text-md text-center text-errorRed h-fit">
                                {error}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default AccountInfoForm;
