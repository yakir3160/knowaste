import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from "./UserContext";
import { useAuthContext } from "./AuthContext";
import MenuCategories from "../MockData/MenuCategories.json";
import MenuItems from "../MockData/MenuItems.json";
import SupplierCategories from "../MockData/SupplierCategories.json";
import SupplierProducts from "../MockData/SupplierProducts.json";

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const { user: authUser } = useAuthContext();

    // יצירת ה-state עבור פריטים וקטגוריות
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();

    useEffect(() => {
        // הגדרת הנתונים פעם אחת, לפי סוג המשתמש
        setUserItems( user?.accountType === 'supplier' ? SupplierProducts.products : MenuItems.MenuItems);
        setCategories(user?.accountType === 'supplier' ? SupplierCategories : MenuCategories);
        console.log('User Items Set');
    }, [authUser]);

    return (
        <ItemsContext.Provider value={{ userItems, categories }}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
