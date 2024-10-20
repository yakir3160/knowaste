import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';

import {useNavigate} from "react-router-dom";

export const useGoogleSignIn = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            //  TODO: // Add a check to see if the user is signed in ,create hook for this function,and handle token //
            navigate('/admin-panel');
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };
    return {signInWithGoogle};
}