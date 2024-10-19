import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const useLogin = (navigate) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin-panel'); // הניווט מתבצע בהצלחה
        } catch (err) {
            // ניתוח השגיאה והצגת הודעת שגיאה מתאימה
            if (err.code === 'auth/user-not-found') {
                setError('User not found. Please check your email.');
            } else if (err.code === 'auth/wrong-password') {
                console.log('Incorrect password. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};
