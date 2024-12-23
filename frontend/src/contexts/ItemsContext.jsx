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


    // Add report function
    const addReport = (report, reportType) => {
        console.log(`${API_BASE_URL}/api/${reportType}/add-report`);
        console.log('Authorization:', `Bearer ${token}`);
        console.log('report type:', reportType);
        console.log('report:', report);
    };

    // Add menu item
    const addMenuItem = async (itemData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(itemData),
            });
            const data = await response.json();
            console.log('Add menu item:', data);
        } catch (error) {
            console.error('Error adding menu item:', error.message);
        }
    };
    // Get menu items
    const getMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/menu`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserItems(data);
            console.log('Menu items:', data.data);
        } catch (error) {
            console.error('Error fetching menu items:', error.message);
        }
    }
    const getMenuByCategory = async (categoryId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/menu//items-by-category/?category=${categoryId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserItems(data);
            console.log('Menu items by category:', data.data);
        } catch (error) {
            console.error('Error fetching menu items by category:', error.message);
        }
    }
    const deleteMenuItem = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log('Delete menu item:', data);
        } catch (error) {
            console.error('Error deleting menu item:', error.message);
        }
    }


    // useEffect to initialize data
    useEffect(() => {
    //     addMenuItem({
    //         categoryId: "main-courses",
    //         categoryName: "Main Courses",
    //         subCategoryId: "pizza",
    //         subCategoryName: "Pizza",
    //         "id": "1",
    //         "name": "Classic Margherita Pizza",
    //         "price": 58.6,
    //         "ingredients": [
    //         {
    //             "ingredientId": 1,
    //             "quantity": 200,
    //         },
    //         {
    //             "ingredientId": 2,
    //             "quantity": 100,
    //         },
    //         {
    //             "ingredientId": 3,
    //             "quantity": 150,
    //         }
    //     ]
    // });
        getMenuItems();
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
            addReport,
            getMenuItems,
        }}>
            {children}
        </ItemsContext.Provider>
    );
};

// Hook to use the context
export const useItemsContext = () => useContext(ItemsContext);
