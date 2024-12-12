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
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||  'http://localhost:5002';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    console.log('User:', user);
    console.log('Token:', token);
    const navigate = useNavigate();
    const { handleLogout } = useLogout();
    const { handleSignInWithGoogle } = useGoogleSignIn();
    const {handlePasswordResetEmail, success, emailSent} = usePasswordReset();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            console.log("User state changed");
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const clearAuthError = () => setAuthError(null);

    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    setAuthError('This email is already registered. Please login to continue.');
                    navigate('/auth', {
                        state: {
                            showRegister: false,
                            email: values.email,
                        },
                    });
                } else {
                    setAuthError(errorData.error || 'An unexpected error occurred.');
                }
                throw new Error(response.statusText);
            }

            const userData = await response.json();
            setUser(userData.user);
            resetForm();
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error during registration:', error.message);
            setAuthError(error.message || 'An error occurred during registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const login = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setAuthError('Invalid email or password.');
                } else {
                    setAuthError('An unexpected error occurred during login.');
                }
                return;
            }

            // Parse response data
            const userData = await response.json();
            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
            }
            setUser(userData.user);
            setToken(userData.token);
            resetForm();
            navigate('/admin-panel');
        } catch (error) {
            console.error('Login error:', error.message);
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
           const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });
            console.log('Response:', response);

            if (!response.ok) {
                const errorData = await response.json();
                setAuthError(errorData.error || 'An unexpected error occurred.');
                throw new Error(response.statusText);
            }
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
            loading,
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