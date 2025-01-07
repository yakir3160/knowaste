import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from "./UserContext";

const ItemsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');

    // Loading states
    const [menuLoading, setMenuLoading] = useState(true);
    const [inventoryLoading, setInventoryLoading] = useState(true);
    const [reportsLoading, setReportsLoading] = useState(true);

    // Error and success states
    const [itemsError, setItemsError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(null);

    // Data states
    const [menuItems, setMenuItems] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState([]);
    const [salesReports, setSalesReports] = useState([]);
    const [wasteReports, setWasteReports] = useState([]);

    // Cache timestamp states
    const [lastUpdate, setLastUpdate] = useState({
        menu: null,
        inventory: null,
        wasteReports: null,
        salesReports: null
    });

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
            setTimeout(() => setSuccess(null), 3000);
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
        setSaving(true);
        await apiCall(`reports/${reportType}/add`, 'POST', report);
        if (reportType === 'waste') {
            setWasteReports(prevReports => [...prevReports,report]);
        } else if (reportType === 'sales') {
            setSalesReports(prevReports => [...prevReports, report]);
        }
        setSaving(false);
        setSuccess(true);
        // Update cache timestamp
        setLastUpdate(prev => ({
            ...prev,
            [`${reportType}Reports`]: new Date()
        }));
    };

    const getReports = async (reportType) => {
        const now = new Date();
        const lastUpdateTime = lastUpdate[`${reportType}Reports`];

        if (lastUpdateTime && (now - lastUpdateTime) < CACHE_DURATION) {
            return; // Use cached data if within cache duration
        }

        setReportsLoading(true);
        try {
            const response = await apiCall(`reports/${reportType}/list`);
            if (reportType === 'waste') {
                setWasteReports(response.data.data);
            } else if (reportType === 'sales') {
                setSalesReports(response.data.data);
            }
            setLastUpdate(prev => ({
                ...prev,
                [`${reportType}Reports`]: now
            }));
        } catch (error) {
            console.error(`Error fetching ${reportType} reports:`, error);
        } finally {
            setReportsLoading(false);
        }
    };

    const deleteReport = async (reportType, reportId) => {
        await apiCall(`reports/${reportType}/${reportId}`, 'DELETE');
        if (reportType === 'waste') {
            setWasteReports(prev => prev.filter(report => report.reportId !== reportId));
        } else if (reportType === 'sales') {
            setSalesReports(prev => prev.filter(report => report.reportId !== reportId));
        }
    };

    // Menu Items
    const addMenuItem = async (itemData) => {
        setSaving(true);
        const data = await apiCall('menu', 'POST', itemData);
        console.log(data.data);
        setMenuItems(prevItems => [...prevItems, data]);
        setMenuCategories(prevCategories => [...prevCategories, data.category]);
        setSaving(false);
        setSuccess(true);
        setLastUpdate(prev => ({...prev, menu: new Date()}));
        return data;
    };

    const getMenuItems = async (forceRefresh = false) => {
        const now = new Date();
        if (!forceRefresh && lastUpdate.menu && (now - lastUpdate.menu) < CACHE_DURATION) {
            return; // Use cached data if within cache duration
        }

        try {
            setMenuLoading(true);
            const data = await apiCall('menu');
            setMenuItems(data.data);
            setMenuCategories(data.categories);
            setLastUpdate(prev => ({...prev, menu: now}));
        } catch (error) {
            setMenuItems([]);
            setMenuCategories([]);
        } finally {
            setMenuLoading(false);
        }
    };

    const getMenuByCategory = async (categoryId) => {
        try {
            const data = await apiCall(`menu/items-by-category/?category=${categoryId}`);
            return data;
        } catch (error) {
            console.error('Error fetching menu by category:', error);
            return [];
        }
    };

    const deleteMenuItem = async (itemId) => {
        await apiCall(`menu/${itemId}`, 'DELETE');
        setMenuItems(prev => prev.filter(item => item.menuItemId !== itemId));
    };

    // Inventory Items
    const addInventoryItem = async (itemData) => {
        setSaving(true);
        const data = await apiCall('inventory', 'POST', itemData);
        setInventoryItems(prevItems => [...prevItems, itemData]);
        setSaving(false);
        setSuccess(true);
        setLastUpdate(prev => ({...prev, inventory: new Date()}));
        return data;
    };

    const getInventoryItems = async (forceRefresh = false) => {
        const now = new Date();
        if (!forceRefresh && lastUpdate.inventory && (now - lastUpdate.inventory) < CACHE_DURATION) {
            return; // Use cached data if within cache duration
        }

        try {
            setInventoryLoading(true);
            const data = await apiCall('inventory');
            setInventoryItems(data.data);
            setInventoryCategories(data.categories);
            setLastUpdate(prev => ({...prev, inventory: now}));
        } catch (error) {
            setInventoryItems([]);
            setInventoryCategories([]);
        } finally {
            setInventoryLoading(false);
        }
    };

    const deleteInventoryItem = async (itemId) => {
        await apiCall(`inventory/${itemId}`, 'DELETE');
        setInventoryItems(prev => prev.filter(item => item.id !== itemId));
    };

    const addIngredientOrder = async (ingredientId, ingredientData) => {
        const response = await apiCall(`inventory/add_order/${ingredientId}`, 'POST', ingredientData);
        await getInventoryItems(true); // Force refresh inventory after adding order
        return response;
    };

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            try {
                if (user && token) {
                    await Promise.all([
                        menuItems.length === 0 && getMenuItems(),
                        inventoryItems.length === 0 && getInventoryItems(),
                        wasteReports.length === 0 && getReports('waste'),
                        salesReports.length === 0 && getReports('sales')
                    ].filter(Boolean)); // Filter out false values
                }
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        initializeData();

        return () => {
            setMenuItems([]);
            setInventoryItems([]);
            setWasteReports([]);
            setSalesReports([]);
            setLastUpdate({
                menu: null,
                inventory: null,
                wasteReports: null,
                salesReports: null
            });
        };
    }, [user, token]);

    const contextValue = {
        // Loading states
        menuLoading,
        inventoryLoading,
        reportsLoading,
        saving,

        // Data
        menuItems,
        menuCategories,
        inventoryItems,
        inventoryCategories,
        wasteReports,
        salesReports,

        // Error and success states
        itemsError,
        success,

        // Functions
        addMenuItem,
        deleteMenuItem,
        getMenuByCategory,
        getMenuItems,
        addReport,
        deleteReport,
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