import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';

// Firebase & Custom Hooks
import { auth } from "../firebaseConfig";
import { useRegister } from "../Hooks/Auth/useRegister";
import { useLogin } from "../Hooks/Auth/useLogin";
import { useLogout } from "../Hooks/Auth/useLogout";
import { useGoogleSignIn } from "../Hooks/Auth/useGoogleSignIn";
import { usePasswordReset } from "../Hooks/Auth/usePasswordReset";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { handleRegister } = useRegister();
    const { handleLogin } = useLogin();
    const { handleLogout } = useLogout();
    const { handleSignInWithGoogle } = useGoogleSignIn();
    const {
        handlePasswordResetEmail,
        success,
        emailSent
    } = usePasswordReset();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log("User state changed");
        });
        return unsubscribe;
    }, []);

    const clearAuthError = () => setAuthError(null);

    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleRegister(values);
            setUser(auth.currentUser);
            resetForm();
            navigate('/admin-panel');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setAuthError('This email is already registered. Please login to continue.');
                navigate('/auth', {
                    state: {
                        showRegister: false,
                        email: values.email,
                    }
                });
            } else {
                console.error('Error during registration:', error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const login = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleLogin(values.email, values.password);
            setUser(auth.currentUser);
            resetForm();
            navigate('/admin-panel');
        } catch (error) {
            const errorMessages = {
                'auth/invalid-credential': 'Invalid email or password.',
                'auth/user-disabled': 'This account has been disabled.',
                'default': 'An error occurred. Please try again.'
            };
            setAuthError(errorMessages[error.code] || errorMessages.default);
        } finally {
            setSubmitting(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await handleSignInWithGoogle();
            setUser(auth.currentUser);
            navigate('/admin-panel');
        } catch (error) {
            setAuthError('Error during Google sign-in.');
        }
    };

    const logout = async () => {
        try {
            await handleLogout();
            setUser(null);
            navigate('/');
        } catch (error) {
            setAuthError('Error during logout.');
        }
    };

    const passwordResetEmail = async (values) => {
        if (!values.email?.trim()) {
            setAuthError('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await handlePasswordResetEmail(values.email);
            console.log('Password reset email sent');
        } catch (error) {
            const errorMessages = {
                'auth/too-many-requests': 'Too many attempts. Please try again later',
                'default': 'An error occurred. Please try again'
            };
            setAuthError(errorMessages[error.code] || errorMessages.default);
            console.log('Error sending password reset email:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            signInWithGoogle,
            passwordResetEmail,
            authError,
            setAuthError,
            clearAuthError,
            success,
            emailSent,
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuthContext = () => useContext(AuthContext);