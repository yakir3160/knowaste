import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const useLogout = () => {


    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    };

    return { handleLogout, };
};
