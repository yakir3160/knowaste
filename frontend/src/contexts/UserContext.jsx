import React, {createContext, useContext, useEffect} from 'react'; // ייבוא רכיבי React
import {useUserData} from '../Hooks/User/useUserData';
import {useAuthContext} from "./AuthContext"; // ייבוא פונקציה לקבלת נתוני המשתמש

const UserContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const UserProvider = ({ children }) => {
     const {user : userBaseData} = useAuthContext();
        const {updateUserDetails,userError,setUserError,loading,success,setSuccess} = useUserData();
    useEffect(() => {
        setUserError(null);
    }, []);
    return (
        <UserContext.Provider value={{userBaseData ,updateUserDetails,userError,setUserError,loading,success,setSuccess}}> {/* הפונקציה מחזירה את ההקשר עם ערכים */}
            {children} {/* רכיבי הילדים שיועברו לתוך UserProvider */}
        </UserContext.Provider>
    );
};


// פונקציה להחזיר את ההקשר הנוכחי לנתוני המשתמש
export const useUserContext = () => useContext(UserContext); // שימוש בהקשר לנתוני המשתמש
