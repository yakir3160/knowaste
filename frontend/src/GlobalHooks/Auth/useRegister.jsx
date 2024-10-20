import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

export const useRegister = () => {
    const [error, setError] = useState(null);

    const handleRegister = async (values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const userData = { ...values, uid: userCredential.user.uid };
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            toast.success('Registration successful!');
        } catch (error) {
            setError(error.message);
            toast.error('Registration failed: ' + error.message);
        }
    };

    return { handleRegister, error };
};
