import React, {createContext, useContext, useEffect} from 'react'; // ייבוא רכיבי React
import {useUserBaseData} from '../Hooks/User/useUserBaseData'; // ייבוא פונקציה לקבלת נתוני המשתמש

const UserContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const UserProvider = ({ children }) => {
     const {userBaseData,updateUserDetails, loadingData, error,success,setSuccess} = useUserBaseData(); // שימוש בפונקציה לקבלת נתוני המשתמש
    return (
        <UserContext.Provider value={{userBaseData,updateUserDetails,error,loadingData,success,setSuccess}}> {/* הפונקציה מחזירה את ההקשר עם ערכים */}
            {children} {/* רכיבי הילדים שיועברו לתוך UserProvider */}
        </UserContext.Provider>
    );
};

// פונקציה להחזיר את ההקשר הנוכחי לנתוני המשתמש
export const useUserContext = () => useContext(UserContext); // שימוש בהקשר לנתוני המשתמש
