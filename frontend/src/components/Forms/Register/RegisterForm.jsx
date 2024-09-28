import React, { Suspense } from 'react';
import GlobalField from "../../Common/inputs/GlobalField";
import { validatePassword } from './RegisterUtils';
import Button from "../../Common/Button/Button";

const RegisterForm = ({ cities, handleChange, setPasswordStatus, isSubmitting }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <GlobalField
                name="businessName"
                legend="Business Name"
                type="text"
            />
            <GlobalField
                name="contactName"
                legend="Contact Name"
                type="text"
            />
            <GlobalField
                name="phone"
                legend="Phone"
                type="tel"
            />
            <GlobalField
                name="email"
                legend="Email"
                type="email"
            />
            <GlobalField
                name="address"
                legend="Address"
                type="text"
            />
            <Suspense fallback={<div>Loading...</div>}>
                <GlobalField
                    name="city"
                    options={cities.map((city) => ({ value: city, label: city }))}
                    as="select"
                />
            </Suspense>
            <GlobalField
                name="zipCode"
                legend="Zip"
                type="text"
            />
            <GlobalField
                name="accountType"
                as="select"
                options={[
                    { value: '', label: 'Account Type' },
                    { value: 'restaurant-manager', label: 'Restaurant Manager' },
                    { value: 'supplier', label: 'Supplier' }
                ]}
            />
            <GlobalField
                name="password"
                legend="Password"
                type="password"
                onChange={(e) => {
                    handleChange(e);
                    validatePassword(e.target.value, setPasswordStatus);
                }}
            />
            <GlobalField
                name="repeatPassword"
                legend="Repeat Password"
                type="password"
            />
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex justify-center items-center h-full">
                <Button className="text-titles w-full h-14" type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default RegisterForm;