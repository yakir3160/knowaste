import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import Ingredients from "../MockData/Ingredeints.json";
import SupplierProducts from "../MockData/SupplierProducts.json";
import IngredientCategories from '../MockData/ingredientCategories.json';

// Create the context
const ItemsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const ingredientCategories = IngredientCategories.categories;

    // Helper function to extract ingredients
    const extractIngredients = (menuData) => {
        if (!menuData) return [];

        const menuItems = menuData.categories?.flatMap(category =>
            category.items?.length > 0
                ? category.items
                : category.subCategories?.flatMap(sub => sub.items) || []
        ) || [];

        const ingredientsList = menuItems.flatMap(item => item.ingredients);

        const groupedIngredients = ingredientsList.reduce((acc, ingredient) => {
            const existingIngredient = acc.find(i => i.id === ingredient.ingredientId);
            if (existingIngredient) {
                existingIngredient.baseQuantity += ingredient.amountInGrams;
            } else {
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

        return groupedIngredients;
    };

    // Add report function
    const addReport = (report, reportType) => {
        console.log(`${API_BASE_URL}/api/${reportType}/add-report`);
        console.log('Authorization:', `Bearer ${token}`);
        console.log('report type:', reportType);
        console.log('report:', report);
    };

    // useEffect to initialize data
    useEffect(() => {
        setLoadingItems(true);

        const isSupplier = user?.accountType === 'supplier';

        setUserItems(isSupplier ? SupplierProducts : MenuItems.categories || []);
        setCategories(
            isSupplier
                ? []
                : MenuItems.categories?.map(category => ({
                name: category.name,
                subCategories: category.subCategories?.map(sub => ({
                    id: sub.id,
                    name: sub.name
                })) || []
            })) || []
        );
        setIngredients(
            isSupplier
                ? []
                : Ingredients.ingredients || []
        );

        setLoadingItems(false);

        return () => {
            setUserItems([]);
            setCategories([]);
            setIngredients([]);
        };
    }, [user]);

    return (
        <ItemsContext.Provider value={{
            userItems,
            categories,
            ingredients,
            setIngredients,
            loadingItems,
            ingredientCategories,
            addReport
        }}>
            {children}
        </ItemsContext.Provider>
    );
};

// Hook to use the context
export const useItemsContext = () => useContext(ItemsContext);
