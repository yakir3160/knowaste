
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../context/AuthContext";


export const usePasswordReset = () => {
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState(null);
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const handlePasswordReset = async (values,actionCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: actionCode, newPassword: values.password }),
            })
            const data = await response.json();
            console.log('Reset password response:', data);
            setSuccess(true);
            navigate('/auth', { state: { message: 'Password reset successful! Please log in with your new password.', type: 'success' } });
        }catch (error) {
            setError(error)
        }

    }
    const updatePasswordWithVerification = async (currentPassword, newPassword,{setSubmitting,resetForm}) => {
    if (!user) {
        setError('User is not authenticated');
        return;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, currentPassword, newPassword }),
        });
        const data = await response.json();
        console.log('Update password response:', data);
        if (!response.ok) {
            setError(data.error);
        } else {
            setSuccess(true);
            setSubmitting(false);
            resetForm();
        }
    } catch (error) {
        setError(error.message);
    }
};
    return {handlePasswordReset,updatePasswordWithVerification,success,setSuccess,error,};

}