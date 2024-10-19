import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const useLogout = (navigate) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogout, error, loading };
};
