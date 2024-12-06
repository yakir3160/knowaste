import React, { } from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import AccountInfoForm from './AccountInfoForm';
import PasswordUpdateForm from './PasswordUpdateForm';

const Account = () => {
    return (
            <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-3 p-2 space-y-10 md:space-y-0  md:space-x-5">
                <AccountInfoForm />
                <PasswordUpdateForm />
            </AdminPanelContainer>
    );
};

export default Account;
