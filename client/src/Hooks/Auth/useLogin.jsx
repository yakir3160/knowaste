import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);


    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw error;
        }
    finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, };
};
