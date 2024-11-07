import {auth} from '../../firebaseConfig';
import {sendPasswordResetEmail,confirmPasswordReset,updatePassword,EmailAuthProvider,reauthenticateWithCredential} from 'firebase/auth';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";


export const usePasswordReset = () => {
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handlePasswordResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            throw error;
        }
    };
    const handlePasswordReset = async (values,actionCode) => {
        try {
            console.log(actionCode);
            await confirmPasswordReset(auth,actionCode ,values.password);
            setSuccess(true);
            navigate('/auth', { state: { message: 'Password reset successful! Please log in with your new password.', type: 'success' } });
        }catch (error) {
            setError(error)
        }

    }
    const updatePasswordWithVerification = async (currentPassword,newPassword) => {
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess(true);
        } catch (error) {
            switch (error.code){
                case 'auth/invalid-credential':
                    setError('wrong current password');
                    break;
                default:
                    setError('Error updating password');
            }
        }
    }
    return {handlePasswordResetEmail,handlePasswordReset,updatePasswordWithVerification,success,setSuccess, emailSent,error,};

}