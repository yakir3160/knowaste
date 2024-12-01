import React, {createContext, useContext, useEffect, useState} from 'react';
import {useUserContext} from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import SupplierProducts from "../MockData/SupplierProducts.json";

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();
    const [ingredients, setIngredients] = useState([]);

    const extractIngredients = (menuData) => {
        if (!menuData) return []; // אם אין נתוני תפריט, מחזירים מערך ריק

        // חילוץ כל הפריטים מתוך קטגוריות ותתי קטגוריות
        const menuItems = menuData?.categories.flatMap(category =>
            category.items || // אם יש פריטים ישירים בקטגוריה
            category.subCategories.flatMap(sub => sub.items.map(item => item)) // אחרת, לוקחים פריטים מתוך תתי-קטגוריות
        );

        // חילוץ רשימת המרכיבים מכל פריטי התפריט
        const ingredients = menuItems?.flatMap(item => item.ingredients);

        // איחוד מרכיבים זהים וסיכום הכמות שלהם
        return ingredients.reduce((acc, ingredient) => {
            // בדיקה אם המרכיב כבר קיים ברשימה על פי שמו
            const existingIngredient = acc.find(item => item.name === ingredient.name);

            if (existingIngredient) {
                // אם המרכיב כבר קיים, מוסיפים את הכמות הנוכחית לכמות הבסיסית
                existingIngredient.baseQuantity += ingredient.amountInGrams;
            } else {
                // אם המרכיב אינו קיים, מוסיפים אותו כרשומה חדשה
                acc.push({
                    id: ingredient.ingredientId,
                    name: ingredient.name,
                    baseQuantity: ingredient.amountInGrams,
                    stockQuantity: 0,
                    unitType: 'grams'
                });
            }

            return acc;
        }, []);
    };

    useEffect(() => {
        setLoadingItems(true);
        setUserItems(
            user?.accountType === 'supplier'
                ? SupplierProducts
                : MenuItems.categories
        );
        setCategories(
            user?.accountType === 'supplier'
                ? SupplierProducts
                : MenuItems.categories
                    .map(category => ({
                        name: category.name,
                        subCategories: category.subCategories?.map(sub => ({
                        id: sub.id,
                        name: sub.name
                    })) || []
                })) || []
        );
        setIngredients(
            user?.accountType === 'supplier'
                ? []
                : extractIngredients(MenuItems)
        )

        console.log('User Items Set');
        console.log('user categories',categories)
        console.log('user ingredients',ingredients)
        setLoadingItems(false);
        return () => {
            setUserItems(null);
            setCategories(null);
        };
    }, [user]);

    return (
        <ItemsContext.Provider value={{ userItems, categories ,ingredients, setIngredients,loadingItems}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
