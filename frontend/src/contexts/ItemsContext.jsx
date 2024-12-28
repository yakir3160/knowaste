import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from "./UserContext";

const ItemsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');
    const [loadingItems, setLoadingItems] = useState(true);
    const [itemsError, setItemsError] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState([]);

    // API calls with error handling
    const apiCall = async (endpoint, method = 'GET', body = null) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                ...(body && { 'Content-Type': 'application/json' })
            };

            const config = {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) })
            };

            const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                const error = {
                    status: response.status,
                    message: data.message || 'Operation failed',
                    data: data
                };

                setItemsError(error.message);
                setTimeout(() => setItemsError(null), 3000);
                throw error;
            }

            return data;

        } catch (error) {
            const errorMessage = error.message || 'Failed to complete operation';
            setItemsError(errorMessage);
            setTimeout(() => setItemsError(null), 3000);

            throw {
                status: error.status || 500,
                message: errorMessage,
                originalError: error
            };
        }
    };


    // Reports
    const addReport = async (report, reportType) => {
        return await apiCall(`${reportType}/add-report`, 'POST', report);
    };

    // Menu Items
    const addMenuItem = async (itemData) => {
        const data = await apiCall('menu', 'POST', itemData);
        setMenuItems([...menuItems, data]);
        getMenuItems(); // Refresh the list
        return data;
    };

    const getMenuItems = async () => {
        try {
            setLoadingItems(true);
            const data = await apiCall('menu');
            setMenuItems(data.data);
            setCategories(data.categories);
        } catch (error) {
            // Handle error appropriately
            setMenuItems([]);
            setCategories([]);
        } finally {
            setLoadingItems(false);
        }
    };

    const getMenuByCategory = async (categoryId) => {
        try {
            const data = await apiCall(`menu/items-by-category/?category=${categoryId}`);
            setMenuItems(data);
            return data;
        } catch (error) {
            setMenuItems([]);
            throw error;
        }
    };

    const deleteMenuItem = async (itemId) => {
        await apiCall(`menu/${itemId}`, 'DELETE');
        await getMenuItems(); // Refresh the list
    };

    // Inventory Items
    const addInventoryItem = async (itemData) => {
        const data = await apiCall('inventory', 'POST', itemData);
        await getInventoryItems(); // Refresh the list
        return data;
    };

    const getInventoryItems = async () => {
        try {
            const data = await apiCall('inventory');
            setInventoryItems(data.data);
            setInventoryCategories(data.categories);
        } catch (error) {
            setInventoryItems([]);
            setInventoryCategories([]);
            throw error;
        }
    };

    const deleteInventoryItem = async (itemId) => {
        await apiCall(`inventory/${itemId}`, 'DELETE');
        await getInventoryItems(); // Refresh the list
    };

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    getMenuItems(),
                    getInventoryItems()
                ]);
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        if (user && token) {
            initializeData();
        }
        return () => {
            setMenuItems([]);
            setInventoryItems([]);
        };

    }, [user, token]);

    const contextValue = {
        userItems: menuItems,
        categories,
        inventoryItems,
        setInventoryItems,
        inventoryCategories,
        setInventoryCategories,
        loadingItems,
        itemsError,
        addMenuItem,
        deleteMenuItem,
        getMenuByCategory,
        addReport,
        getMenuItems,
        addInventoryItem,
        deleteInventoryItem,
        getInventoryItems,
    };

    return (
        <ItemsContext.Provider value={contextValue}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItemsContext = () => {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error('useItemsContext must be used within an ItemsProvider');
    }
    return context;
};