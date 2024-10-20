import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from "react-toastify";
import { useRegister } from "../GlobalHooks/Auth/useRegister";
import { useLogin } from "../GlobalHooks/Auth/useLogin";
import { useLogout } from "../GlobalHooks/Auth/useLogout";
import { useGoogleSignIn } from "../GlobalHooks/Auth/useGoogleSignIn";

// AuthProvider הוא רכיב שמספק את ההקשר לאותנטיקציה במערכת.
// הוא מנהל את המצב של המשתמש (logged in / logged out),
// ומספק פונקציות לרישום, התחברות ויציאה למשתמשים.

// יצירת הקשר AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // מצב המשתמש הנוכחי
    const navigate = useNavigate(); // נווט לדפים שונים
    const { handleRegister } = useRegister(); // הפונקציה לרישום משתמש
    const { handleLogin, error: loginError } = useLogin(); // הפונקציה להתחברות
    const { handleLogout } = useLogout(); // הפונקציה ליציאה
    const { handleSignInWithGoogle } = useGoogleSignIn(); // הפונקציה להתחברות עם גוגל

    // הקשבה לשינויים במצב ההזדהות של המשתמש
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // עדכון מצב המשתמש
        });
        return () => unsubscribe(); // ניתוק ההאזנה כאשר הקומפוננטה לא בשימוש
    }, []);

    // פונקציית רישום משתמש
    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleRegister(values); // קריאה לפונקציית הרישום
            setUser(auth.currentUser); // עדכון מצב המשתמש
            navigate('/admin-panel'); // מעבר לדף הניהול
        } catch (error) {
            handleAuthError(error, values.email); // טיפול בשגיאות
        } finally {
            setSubmitting(false); // ביטול מצב של "ממתין"
            resetForm(); // איפוס הטופס
        }
    };

    // פונקציית התחברות משתמש
    const login = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleLogin(values.email, values.password); // קריאה לפונקציית ההתחברות
            setUser(auth.currentUser); // עדכון מצב המשתמש
            navigate('/admin-panel'); // מעבר לדף הניהול
        } catch (error) {
            console.error('Error during login:', error); // טיפול בשגיאות
        } finally {
            setSubmitting(false); // ביטול מצב של "ממתין"
            resetForm(); // איפוס הטופס
        }
    };

    // פונקציית התחברות עם גוגל
    const signInWithGoogle = async () => {
        try {
            await handleSignInWithGoogle(); // הפעל את הפונקציה להתחברות עם גוגל
            setUser(auth.currentUser); // עדכן את המשתמש
            navigate('/admin-panel'); // הוביל לדף ניהול
        } catch (error) {
            console.error('Error during Google sign-in:', error); // טיפול בשגיאות
        }
    };

    // פונקציית יציאה
    const logout = async () => {
        try {
            await handleLogout(); // קריאה לפונקציית היציאה
            setUser(null); // עדכון מצב המשתמש
            navigate('/'); // מעבר לדף הבית
        } catch (error) {
            console.error('Error during logout:', error); // טיפול בשגיאות
        }
    };

    // פונקציית טיפול בשגיאות הזדהות
    const handleAuthError = (error, email) => {
        if (error.code === 'auth/email-already-in-use') {
            navigate('/auth', {
                state: { showRegister: false, email } // העברת מצב לדף ההתחברות
            });
        } else {
            toast.error('An error occurred. Please try again.'); // הצגת הודעת שגיאה
            console.error('Error:', error); // טיפול בשגיאות
        }
    };

    // החזרת הקונטקסט עם הפונקציות הנחוצות
    return (
        <AuthContext.Provider value={{ user, login, register, logout, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

// הפונקציה להחזרת ההקשר
export const useAuthContext = () => useContext(AuthContext);
