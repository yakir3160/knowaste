import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../firebaseConfig";

const AuthContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [firebaseToken, setFirebaseToken] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const navigate = useNavigate();

    // Centralized API call handler
    const apiCall = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
        try {
            const headers = {
                ...(body && { 'Content-Type': 'application/json' }),
                ...customHeaders
            };

            const config = {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) })
            };

            const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An unexpected error occurred');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    };

    // Initialize authentication state
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('authToken');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const userData = await apiCall('me', 'GET', null, {
                    Authorization: `Bearer ${storedToken}`
                });

                setUser(userData.user);
                setToken(storedToken);
            } catch (error) {
                setUser(null);
                setFirebaseToken(null);
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const clearAuthError = () => setAuthError(null);

    // Authentication actions
    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            clearAuthError();
            const userData = await apiCall('register', 'POST', values);

            setUser(userData.user);
            resetForm();
            navigate('/admin-panel');
        } catch (error) {
            if (error.message.includes('409')) {
                setAuthError('This email is already registered. Please login to continue.');
                navigate('/auth', {
                    state: {
                        showRegister: false,
                        email: values.email,
                    },
                });
            } else {
                setAuthError(error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const login = async (values, { setSubmitting, resetForm }) => {
        try {
            clearAuthError();
            const userData = await apiCall('login', 'POST', {
                email: values.email,
                password: values.password
            });

            if (userData.token) {
                localStorage.setItem('authToken', userData.token);
                setToken(userData.token);
            }

            setFirebaseToken(userData.firebaseToken);
            setUser(userData.user);
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
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            provider.setCustomParameters({ prompt: 'consent' });

            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();

            const userData = await apiCall('google', 'POST', {
                token,
                isSignUp: true,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL
            });

            localStorage.setItem('authToken', userData.token);
            setUser(userData.user);
            setToken(userData.token);
            navigate('/admin-panel');
        } catch (error) {
            setAuthError('Error during Google sign-in.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
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
            await apiCall('reset-password', 'POST', {
                email: values.email
            });
            setEmailSent(true);
        } catch (error) {
            const errorMessages = {
                'auth/too-many-requests': 'Too many attempts. Please try again later',
                'default': 'An error occurred. Please try again'
            };
            setAuthError(errorMessages[error.code] || errorMessages.default);
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async (newEmail) => {
        try {
            await apiCall('update-email', 'POST', {
                firebaseToken,
                newEmail
            });
            return true;
        } catch (error) {
            setAuthError('An error occurred. Please try again.');
            return false;
        }
    };

    const contextValue = {
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
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};