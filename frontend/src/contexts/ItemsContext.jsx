import React, {createContext, useContext, useEffect, useState} from 'react';
import {useUserContext} from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import SupplierProducts from "../MockData/SupplierProducts.json";
import IngredientCategories from '../MockData/ingredientCategories.json';

// יצירת הקונטקסט
const ItemsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();
    const [ingredients, setIngredients] = useState([]);
    const ingredientCategories = IngredientCategories.categories.map(category => category);
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
const addReport = (report, reportType) => {
    // const result = fetch(`${API_BASE_URL}/api/${reportType}/add-report`, {
        // method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        // },
        // body: JSON.stringify(report),
    // });
    console.log(`${API_BASE_URL}/api/${reportType}/add-report`)
    console.log('report type:', reportType);
    console.log('report:', report);
}

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
        setLoadingItems(false);
        return () => {
            setUserItems(null);
            setCategories(null);
        };
    }, [user]);


    return (
        <ItemsContext.Provider value={{ userItems, categories ,ingredients, setIngredients,loadingItems,ingredientCategories,addReport}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
