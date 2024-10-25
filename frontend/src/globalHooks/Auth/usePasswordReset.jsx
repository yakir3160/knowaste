import {auth} from '../../firebaseConfig';
import {sendPasswordResetEmail,confirmPasswordReset} from 'firebase/auth';
import {useState} from 'react';


export const usePasswordReset = () => {

    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);


    const handlePasswordResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            throw error;
        }
    };
    const handlePasswordReset = async (values) => {
        try {
            const name = values.email;
            await confirmPasswordReset(auth,name, values.oobCode, values.password);
            setSuccess(true);
            setEmailSent(false);
        }catch (error) {
            throw error;
        }finally {

        }

    }
    return {handlePasswordResetEmail,handlePasswordReset,success, emailSent};

}