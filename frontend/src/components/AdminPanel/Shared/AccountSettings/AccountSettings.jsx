import React, { } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import AccountInfoForm from './AccountInfoForm';
import PasswordUpdateForm from './PasswordUpdateForm';

const AccountSettings = () => {
    return (
            <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-3 gap-10 p-4">
                <AccountInfoForm />
                <PasswordUpdateForm />
            </AdminPanelContainer>
    );
};

export default AccountSettings;
