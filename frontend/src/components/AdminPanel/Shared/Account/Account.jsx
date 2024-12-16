import React, {useEffect} from 'react';
import AdminPanelContainer from "../../AdminPanelContainer";
import UserDetailsForm from './UserDetailsForm';
import EmailUpdateForm from './EmailUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm';
import {useAuthContext} from "../../../../contexts/AuthContext";
import {useUserContext} from "../../../../contexts/UserContext";
import LoadingOverlay from "../../../Common/Overlays/LoadingOverlay";
import SavingOverlay from "../../../Common/Overlays/SavingOverlay";

const Account = () => {
    const { user } = useAuthContext();
    const {loading,success,setSuccess} = useUserContext();

    useEffect(() => {
        setTimeout(
            () => {
                setSuccess(false);
            }, 5000
        )
    }, []);
    return (
        <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-3 p-2 space-y-10 md:space-y-0 md:space-x-5">
            <div className="col-span-2 space-y-5">
                {
                    loading  ? (
                            <LoadingOverlay loading={loading} success={success} setSuccess={setSuccess} />
                        )
                        : success ? (
                            <SavingOverlay loading={loading} success={success} setSuccess={setSuccess} />
                        ):
                        <>
                            <UserDetailsForm user={user} />
                            <EmailUpdateForm user={user} />
                        </>
                }
            </div>
            <PasswordUpdateForm />
        </AdminPanelContainer>
    );
};

export default Account;
