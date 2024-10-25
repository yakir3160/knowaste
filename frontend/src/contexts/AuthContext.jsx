import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useRegister } from "../globalHooks/Auth/useRegister";
import { useLogin } from "../globalHooks/Auth/useLogin";
import { useLogout } from "../globalHooks/Auth/useLogout";
import { useGoogleSignIn } from "../globalHooks/Auth/useGoogleSignIn";
import {usePasswordReset} from "../globalHooks/Auth/usePasswordReset";

// AuthProvider הוא רכיב שמספק את ההקשר לאותנטיקציה במערכת.
// הוא מנהל את המצב של המשתמש (logged in / logged out),
// ומספק פונקציות לרישום, התחברות ויציאה למשתמשים.

// יצירת הקשר AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // מצב המשתמש הנוכחי
    const [authError, setAuthError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // נווט לדפים שונים
    const { handleRegister,} = useRegister(); // הפונקציה לרישום משתמש
    const { handleLogin, } = useLogin(); // הפונקציה להתחברות
    const { handleLogout } = useLogout(); // הפונקציה ליציאה
    const { handleSignInWithGoogle } = useGoogleSignIn(); // הפונקציה להתחברות עם גוגל
    const {handlePasswordResetEmail,handlePasswordReset,success,emailSent,} = usePasswordReset();

    // הקשבה לשינויים במצב ההזדהות של המשתמש
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // עדכון מצב המשתמש
        });
        return () => unsubscribe(); // ניתוק ההאזנה כאשר הקומפוננטה לא בשימוש
    }, []);


    const clearAuthError = () => {setAuthError(null)};

    // פונקציית רישום משתמש
    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleRegister(values);
            setUser(auth.currentUser);
            navigate('/admin-panel');
            resetForm();
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


    // פונקציית התחברות משתמש
    const login = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleLogin(values.email, values.password);
            setUser(auth.currentUser);
            navigate('/admin-panel');
            resetForm();
        } catch (error) {
            console.log('Error during login:', error.code);
            switch (error.code) {
                case 'auth/invalid-credential':
                    setAuthError('Invalid email or password.');
                    break;
                case 'auth/user-disabled':
                    setAuthError('This account has been disabled.');
                    break;
                default:
                    setAuthError('An error occurred. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };


    // פונקציית התחברות עם גוגל
    const signInWithGoogle = async () => {
        try {
            await handleSignInWithGoogle(); // הפעל את הפונקציה להתחברות עם גוגל
            setUser(auth.currentUser); // עדכן את המשתמש
            navigate('/admin-panel'); // הוביל לדף ניהול
        } catch (error) {
            setAuthError('Error during Google sign-in:')// טיפול בשגיאות
        }
    };

    // פונקציית יציאה
    const logout = async () => {
        try {
            await handleLogout(); // קריאה לפונקציית היציאה
            setUser(null); // עדכון מצב המשתמש
            navigate('/'); // מעבר לדף הבית
        } catch (error) {
            setAuthError('Error during logout:'); // טיפול בשגיאות
        }
    };

    // פונקצייה לשליחת מייל לאיפוס סיסמא
    const passwordResetEmail = async (values) => {
        if (!values.email || !values.email.trim()) {
            setAuthError('Please enter your email address');
            return;
        }
        setLoading(true);
        try {

            await handlePasswordResetEmail(values.email);
            console.log('Password reset email sent');
        } catch (error) {
            switch (error.code) {
                case 'auth/too-many-requests':
                    setAuthError('Too many attempts. Please try again later');
                    break;
                default:
                       setAuthError('An error occurred. Please try again');
            }
        }finally {
            setLoading(false);
        }
    };
    const passwordReset = async (values ,{ setSubmitting, resetForm }) => {
        try {
            await handlePasswordReset(values);
            console.log('Password reset successful');
        } catch (error) {
            switch (error.code) {
                case 'auth/expired-action-code':
                    setAuthError('The action code has expired');
                    break;
                case 'auth/invalid-action-code':
                    setAuthError('The action code is invalid');
                    break;
                default:
                    setAuthError('An error occurred. Please try again');
            }
        } finally {
            setSubmitting(false);
            resetForm();
        }
    }

    // החזרת הקונטקסט עם הפונקציות הנחוצות
    return (
        <AuthContext.Provider value={{ user, login, register, logout, signInWithGoogle,passwordResetEmail,passwordReset,authError,clearAuthError,success ,emailSent,}}>
            {children}
        </AuthContext.Provider>
    );
};

// הפונקציה להחזרת ההקשר
export const useAuthContext = () => useContext(AuthContext);
