import {auth} from '../../firebaseConfig';
import {sendPasswordResetEmail,confirmPasswordReset} from 'firebase/auth';
import {useState} from 'react';


export const usePasswordReset = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);


    const handlePasswordResetEmail = async (values, { setSubmitting }) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, values.email);
            setEmailSent(true);
            setSuccess(true);
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/user-not-found':
                    setError('No user found with this email address');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many attempts. Please try again later');
                    break;
                default:
                    setError('An error occurred. Please try again');
            }
        } finally {
            setSubmitting(false);
        }
    };
    const handlePasswordReset = async (values, { setSubmitting }) => {
        try {
            setError(null);
            await confirmPasswordReset(auth, values.oobCode, values.password);
            setSuccess(true);
            setEmailSent(false);
        }catch (error) {
            switch (error.code) {
                case 'auth/expired-action-code':
                    setError('The action code has expired');
                    break;
                case 'auth/invalid-action-code':
                    setError('The action code is invalid');
                    break;
                default:
                    setError('An error occurred. Please try again');
            }
        }finally {
            setSubmitting(false);
        }

    }
    return {handlePasswordResetEmail,handlePasswordReset, error,success};

}