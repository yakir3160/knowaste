import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';

export const useGoogleSignIn = () => {
    const handleSignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in successfully!");

        } catch (error) {
            console.error('Error during Google sign-in:', error);
            alert(`Error during Google sign-in: ${error.message}`);
        }
    };

    return { handleSignInWithGoogle };
};
