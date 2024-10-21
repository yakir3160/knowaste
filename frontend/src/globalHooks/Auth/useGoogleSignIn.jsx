import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseConfig';

export const useGoogleSignIn = () => {
    const handleSignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);

        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return { handleSignInWithGoogle };
};
