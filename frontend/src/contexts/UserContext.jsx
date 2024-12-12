import React, {createContext, useContext, useEffect} from 'react'; // ייבוא רכיבי React
import {useUserBaseData} from '../Hooks/User/useUserBaseData';
import {useAuthContext} from "./AuthContext"; // ייבוא פונקציה לקבלת נתוני המשתמש

const UserContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const UserProvider = ({ children }) => {
     const {user : userBaseData} = useAuthContext();
    return (
        <UserContext.Provider value={{userBaseData}}> {/* הפונקציה מחזירה את ההקשר עם ערכים */}
            {children} {/* רכיבי הילדים שיועברו לתוך UserProvider */}
        </UserContext.Provider>
    );
};
// updateUserDetails,error,loadingData,success,setSuccess

// פונקציה להחזיר את ההקשר הנוכחי לנתוני המשתמש
export const useUserContext = () => useContext(UserContext); // שימוש בהקשר לנתוני המשתמש
