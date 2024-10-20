// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRegister } from "../GlobalHooks/Auth/useRegister"; // ייבוא פונקציית הרשמה
import { useLogin } from "../GlobalHooks/Auth/useLogin";
import {useLogout} from "../GlobalHooks/Auth/useLogout";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { handleRegister } = useRegister(navigate);
    const { handleLogin,error ,clearError} = useLogin(navigate);
    const { handleLogout } = useLogout(navigate);



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('User:', currentUser);
        });
        return () => unsubscribe();
    }, []);

    const register = async (values,{setSubmitting, resetForm}) => {
        try {
            await handleRegister(values,{setSubmitting, resetForm});
            const user = auth.currentUser;
            setUser(user);
            console.log('User registered:', user);
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error during registration:', error);
        } finally {
            setSubmitting(false);
            resetForm();
        }
    };

    const login = async (values, setSubmitting, resetForm) => {
        try {
            await handleLogin(values.email, values.password);
            const user = auth.currentUser;
            setUser(user);
            console.log('User logged in:', user);
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error during login:', error);

        } finally {
            setSubmitting(false);
            resetForm();
        }
    };

    const logout = async () => {
        try{
            await handleLogout();
            setUser(null);
            navigate('/');
        }catch (error){
            console.error('Error during logout:', error);
        }
    }
    return (
        <UserContext.Provider value={{ user, login, register,logout, setUser,error ,clearError}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
