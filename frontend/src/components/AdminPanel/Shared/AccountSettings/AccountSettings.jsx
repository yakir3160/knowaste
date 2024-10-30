import React, { useEffect } from 'react';
import { useUserContext } from "../../../../contexts/UserContext";
import AdminPanelContainer from "../../AdminPanelContainer";
import AccountInfoForm from '../../../Forms/AccountInfoForm';
import PasswordUpdateForm from '../../../Forms/PasswordUpdateForm';
import Card from "../../../Common/Card/Card";
import {usePasswordReset} from "../../../../Hooks/Auth/usePasswordReset";

const AccountSettings = () => {
    return (
            <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 p-4">
                <AccountInfoForm />
                <PasswordUpdateForm />
            </AdminPanelContainer>
    );
};

export default AccountSettings;
