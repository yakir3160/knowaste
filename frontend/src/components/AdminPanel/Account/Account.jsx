import React, { useEffect } from 'react';
import AdminPanelContainer from "../AdminPanelContainer";
import UserDetailsForm from './UserDetailsForm';
import EmailUpdateForm from './EmailUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm';
import { useAuthContext } from "../../../context/AuthContext";
import { useUserContext } from "../../../context/UserContext";
import LoadingOverlay from "../../Common/Overlays/LoadingOverlay";
import SavingOverlay from "../../Common/Overlays/SavingOverlay";

const Account = () => {
    const { user } = useAuthContext();
    const { loading, success, setSuccess } = useUserContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccess(false);
        }, 4000);

        // נקרא כאשר הקומפוננטה מורדת או במקרה של שינוי
        return () => clearTimeout(timer);
    }, [success,setSuccess]);

    return (
        <AdminPanelContainer pageTitle="Account Settings" layout="grid grid-cols-1 md:grid-cols-3 p-2 gap-2 ">
            <div className="col-span-2 gap-2 ">
                {
                    loading && (
                        <LoadingOverlay loading={loading} text={'Saving...'} success={success} setSuccess={setSuccess} />
                    )
                }
                {
                    success && (
                        <SavingOverlay loading={loading} text={'Saved !'} success={success} setSuccess={setSuccess} />
                    )
                }
                <div className={`space-y-2`}>
                    <UserDetailsForm user={user} />
                    <EmailUpdateForm user={user} />
                </div>
            </div>
            <PasswordUpdateForm />
        </AdminPanelContainer>
    );
};

export default Account;
