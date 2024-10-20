import React, { createContext, useContext } from 'react'; // ייבוא רכיבי React

const UserContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const UserProvider = ({ children }) => {

    return (
        <UserContext.Provider value={{}}> {/* הפונקציה מחזירה את ההקשר עם ערכים */}
            {children} {/* רכיבי הילדים שיועברו לתוך UserProvider */}
        </UserContext.Provider>
    );
};

// פונקציה להחזיר את ההקשר הנוכחי לנתוני המשתמש
export const useUserContext = () => useContext(UserContext); // שימוש בהקשר לנתוני המשתמש
