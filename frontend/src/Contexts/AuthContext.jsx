import React, { createContext, useContext, useState, useEffect } from 'react'; // ייבוא רכיבי React
import { useNavigate } from "react-router-dom";
import { useRegister } from "../GlobalHooks/Auth/useRegister";
import { useLogin } from "../GlobalHooks/Auth/useLogin";
import { useLogout } from "../GlobalHooks/Auth/useLogout";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth'; // פונקציה למעקב אחרי שינויים במצב האותנטיקציה

const AuthContext = createContext(); // יצירת הקשר לאותנטיקציה

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // מצב למעקב אחרי המשתמש הנוכחי
    const navigate = useNavigate(); // פונקציית הניווט
    const { handleRegister } = useRegister(navigate); // הפונקציה להרשמה
    const { handleLogin, error, clearError } = useLogin(navigate); // הפונקציה להתחברות
    const { handleLogout } = useLogout(navigate); // הפונקציה ליציאה

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // הפסקת המעקב על שינויים במצב האותנטיקציה
    }, []);

    // פונקציה לרישום משתמש חדש
    const register = async (values, { setSubmitting, resetForm }) => {
        try {
            await handleRegister(values, { setSubmitting, resetForm }); // קריאה לפונקציית ההרשמה
            const user = auth.currentUser; // קבלת המשתמש הנוכחי לאחר ההרשמה
            setUser(user);
            console.log('User registered:', user);
            navigate('/admin-panel'); // מעבר לדף ניהול לאחר הרשמה
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setSubmitting(false); // סיום ההגשה של הטופס
            resetForm(); // איפוס הטופס לאחר ההגשה
        }
    };

    // פונקציה להתחברות של משתמש
    const login = async (values, setSubmitting, resetForm) => {
        try {
            await handleLogin(values.email, values.password); // קריאה לפונקציית ההתחברות
            const user = auth.currentUser; // קבלת המשתמש הנוכחי לאחר ההתחברות
            setUser(user);
            navigate('/admin-panel'); // מעבר לדף ניהול לאחר התחברות
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setSubmitting(false); // סיום ההגשה של הטופס
            resetForm(); // איפוס הטופס לאחר ההגשה
        }
    };

    // פונקציה ליציאה של המשתמש
    const logout = async () => {
        try {
            await handleLogout(); // קריאה לפונקציית היציאה
            setUser(null); // עדכון המצב של המשתמש ל-null לאחר היציאה
            navigate('/'); // חזרה לדף הבית לאחר היציאה
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // החזרת הקשר לאותנטיקציה עם המידע הנדרש
    return (
        <AuthContext.Provider value={{ user, login, register, logout, setUser, error, clearError }}>
            {children} {/* רכיבי הילדים שיועברו לתוך AuthProvider */}
        </AuthContext.Provider>
    );
};

// פונקציה להחזיר את ההקשר הנוכחי לאותנטיקציה
export const useAuthContext = () => useContext(AuthContext);
