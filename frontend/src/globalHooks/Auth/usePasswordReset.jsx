import {auth} from '../../firebaseConfig';
import {sendPasswordResetEmail,confirmPasswordReset} from 'firebase/auth';
import {useState} from 'react';


export const usePasswordReset = () => {

    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);


    const handlePasswordResetEmail = async (email) => {
        try {
            await handlePasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            throw error;
        }
    };
    const handlePasswordReset = async (values,actionCode) => {
        try {
            await confirmPasswordReset(auth,actionCode ,values.password);
            setSuccess(true);
            setEmailSent(false);
        }catch (error) {
            throw error;
        }
    }
    return {handlePasswordResetEmail,handlePasswordReset,success, emailSent};

}