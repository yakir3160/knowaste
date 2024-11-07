import React, { } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import AccountInfoForm from '../../../Forms/AccountInfoForm';
import PasswordUpdateForm from '../../../Forms/PasswordUpdateForm';

const AccountSettings = () => {
    return (
            <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 p-4">
                <AccountInfoForm />
                <PasswordUpdateForm />
            </AdminPanelContainer>
    );
};

export default AccountSettings;
