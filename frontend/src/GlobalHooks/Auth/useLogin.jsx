import {useEffect, useState} from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useLogin = (navigate) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const clearError = () => setError(null);

    const handleLogin = async (email,password) => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error during login:', error);
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    setError('Invalid email or password. Please check your credentials and try again.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled. Please contact support.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed login attempts. Please try again later.');
                    break;
                default:
                    setError('An error occurred during login. Please try again. ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error,clearError };
};
