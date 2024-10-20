import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useLogout = () => {
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            setError(error.message);
        }
    };

    return { handleLogout, error };
};
