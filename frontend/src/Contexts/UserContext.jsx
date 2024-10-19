import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRegister } from "../GlobalHooks/useRegister";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
// import {useLogin} from "../components/Forms/Login/Hooks/useLogin";
// import {useLogout} from "../components/Functions/Auth/useLogout";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { handleSubmit: registerUser } = useRegister(navigate);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const register = async (values, setSubmitting, resetForm) => {
        try {
            await registerUser(values, { setSubmitting, resetForm });
            const user = auth.currentUser;
            setUser({ ...values, uid: user.uid });
            console.log('User registered:', user);
        } catch (error) {
            console.error('Error during registration:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
        }
    };

    return (
        <UserContext.Provider value={{ user, register, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);