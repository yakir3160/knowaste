import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from "./UserContext";

const ItemsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');
    const [loadingItems, setLoadingItems] = useState(true);
    const [success, setSuccess] = useState(null);
    const [itemsError, setItemsError] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState([]);
    const [salesReports, setSalesReports] = useState([]);
    const [wasteReports, setWasteReports] = useState([]);

    console.log('wasteReports:', wasteReports);
    console.log('salesReports:', salesReports);
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
            setSuccess(true);
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
        const response = await apiCall(`reports/${reportType}/add`, 'POST', report);
        if (reportType === 'waste') {
            setWasteReports([...wasteReports, response.data]);
        } else if (reportType === 'sales') {
            setSalesReports([...salesReports, response.data]);
        }
    };
    const getReports = async (reportType) => {
        const response = await apiCall(`reports/${reportType}/list`);
        if (reportType === 'waste') {
            setWasteReports(response.data.data);
        } else if (reportType === 'sales') {
            setSalesReports(response.data.data);
        }
    }
    const deleteReport = async (reportType,reportId) => {
         await apiCall(`reports/${reportType}/${reportId}`, 'DELETE');
        if (reportType === 'waste') {
            setWasteReports(wasteReports.filter(report => report.reportId !== reportId));
        } else if (reportType === 'sales') {
            setSalesReports(salesReports.filter(report => report.reportId !== reportId));
        }
    }

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
    const addIngredientOrder = async (ingredientId,ingredientData) => {
        return await apiCall(`inventory/add_order/${ingredientId}`, 'POST', ingredientData);
    }

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    getMenuItems(),
                    getInventoryItems(),
                    getReports('waste'),
                    getReports('sales')
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
            setWasteReports([]);
            setSalesReports([]);
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
        wasteReports,
        salesReports,
        addMenuItem,
        deleteMenuItem,
        getMenuByCategory,
        addReport,
        deleteReport,
        getMenuItems,
        addInventoryItem,
        deleteInventoryItem,
        getInventoryItems,
        addIngredientOrder,
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