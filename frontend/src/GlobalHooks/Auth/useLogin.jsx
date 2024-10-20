import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            handleLoginError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginError = (error) => {
        switch (error.code) {
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                setError('Invalid email or password.');
                break;
            case 'auth/user-disabled':
                setError('This account has been disabled.');
                break;
            default:
                setError('An error occurred. Please try again.');
        }
    };

    return { handleLogin, loading, error };
};
