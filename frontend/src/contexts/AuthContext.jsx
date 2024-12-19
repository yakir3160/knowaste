import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

import { auth } from "../firebaseConfig";
import {useUserData} from "../Hooks/User/useUserData";
const AuthContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||  'http://localhost:5002';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [firebaseToken, setFirebaseToken] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if(token) {
            fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Not authorized');
                    }
                    return response.json();
                })
                .then(userData => {
                    setUser(userData.user);
                    setToken(token);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error.message);
                    setUser(null);
                    localStorage.removeItem('authToken');
                    setFirebaseToken(null);
                })
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
        }
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
            clearAuthError();
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                }),
            });
            const userData = await response.json();
            console.log('Response data:', userData);
            if (!response.ok) {
                    setAuthError(userData.error || 'An unexpected error occurred.');
                    return;
            }
            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
                setToken(userData.token);
            }
            setFirebaseToken(userData.firebaseToken);
            setUser(userData.user);
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

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });
            const userData = await response.json();
            localStorage.setItem('authToken', userData.token);
            setUser(userData.user);
            setToken(userData.token);
            setLoading(false);
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error during Google sign-in:', error.message);
            setAuthError('Error during Google sign-in.');
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
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
            setEmailSent(true);

        }
    };
    const updateEmail = async (newEmail) => {
        try {
            console.log('New email:', newEmail);
            console.log('Firebase token:', firebaseToken);
            const response = await fetch(`${API_BASE_URL}/api/auth/update-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify( {
                    firebaseToken:`${firebaseToken}`,
                    newEmail: newEmail,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setAuthError(errorData.error || 'An unexpected error occurred.');
                throw new Error(response.statusText);
            }
            return true;

            // logout();
            // navigate('/auth');
        } catch (error) {
            console.error('Error updating email:', error.message);
            setAuthError('An error occurred. Please try again.');
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            register,
            logout,
            signInWithGoogle,
            passwordResetEmail,
            updateEmail,
            loading,
            success,
            setSuccess,
            authError,
            setAuthError,
            clearAuthError,
            emailSent,
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuthContext = () => useContext(AuthContext);