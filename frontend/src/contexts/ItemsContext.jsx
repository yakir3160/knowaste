import React, {createContext, useContext, useEffect} from 'react'; // ייבוא רכיבי React
 // ייבוא פונקציה לקבלת נתוני המשתמש
const ItemsContext = createContext(); // יצירת הקשר לנתוני המשתמש

export const ItemsProvider = ({ children }) => {

    return (
        <ItemsContext.Provider value={{}}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItemsContext = () => useContext(ItemsContext);
