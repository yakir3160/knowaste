import React, {createContext, useContext } from 'react'; // ייבוא רכיבי React
import {useUserBaseData} from '../globalHooks/User/useUserBaseData'; // ייבוא פונקציה לקבלת נתוני המשתמש

const UserContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const UserProvider = ({ children }) => {
     const {userBaseData, loading, error} = useUserBaseData(); // שימוש בפונקציה לקבלת נתוני המשתמש

    return (
        <UserContext.Provider value={{userBaseData}}> {/* הפונקציה מחזירה את ההקשר עם ערכים */}
            {children} {/* רכיבי הילדים שיועברו לתוך UserProvider */}
        </UserContext.Provider>
    );
};

// פונקציה להחזיר את ההקשר הנוכחי לנתוני המשתמש
export const useUserContext = () => useContext(UserContext); // שימוש בהקשר לנתוני המשתמש
