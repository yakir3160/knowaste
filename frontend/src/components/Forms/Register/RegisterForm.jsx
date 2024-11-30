import React, { Suspense } from 'react';
import GlobalField from "../../Common/inputs/GlobalField";
import Button from "../../Common/Button/Button";


const RegisterForm = ({ cities, handleChange, isSubmitting ,validatePassword}) => {
    return (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <GlobalField
                name="businessName"
                label="Business Name"
                type="text"
                autoFocus={true}
            />
            <GlobalField
                name="contactName"
                label="Contact Name"
                type="text"
            />
            <GlobalField
                name="phone"
                label="Phone"
                type="tel"
            />
            <GlobalField
                name="email"xx
                label="Email"
                type="email"
            />
            <GlobalField
                name="address"
                label="Address"
                type="text"
            />
            <Suspense fallback={<div>Loading...</div>}>
                <GlobalField
                    label="City"
                    name="city"
                    options={cities.map((city) => ({ value: city, label: city }))}
                    type="select"
                />
            </Suspense>
            <GlobalField
                name="zipCode"
                label="Zip"
                type="text"
            />
            <GlobalField
                label={"Account Type"}
                name="accountType"
                type="select"
                options={[
                    { value :"" , label: 'Select Account Type' },
                    { value: 'restaurant-manager', label: 'Restaurant Manager' },
                    { value: 'supplier', label: 'Supplier' }
                ]}
            />
            <GlobalField
                name="kosher"
                type="select"
                label={"Kosher"}
                options={[
                    { value: "", label: 'Select Kosher' },
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                ]}
            />
            <GlobalField
                name="password"
                label="Password"
                type="password"
                onChange={(e) => {
                    handleChange(e);
                    validatePassword(e.target.value);
                }}
            />
            <GlobalField
                name="repeatPassword"
                label="Password confirmation"
                type="password"
            />
            <div className="col-span-1 sm:col-span-2  md:col-span-1 lg:col-span-1 flex justify-center items-center h-full">
                <Button
                    className="text-titles w-full h-14 flex justify-center items-center"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            Submitting...
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </div>

        </div>
    );
};

export default RegisterForm;