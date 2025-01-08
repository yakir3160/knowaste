import React, { createContext, useContext, useState } from 'react';
import { useUserContext } from "./UserContext";

const AnalyticsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const AnalyticsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = async (endpoint, params = {}) => {
        try {
            setLoading(true);
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/api/analytics/${endpoint}${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch analytics data');
            }

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getSalesByDateRange = async (startDate, endDate) => {
        return await apiCall('sales', { startDate, endDate });
    };

    const getTopSellingDishes = async (limit = 10) => {
        return await apiCall('top-dishes', { limit });
    };

    const getLeastSellingDishes = async (limit = 10) => {
        return await apiCall('least-selling-dishes', { limit });
    };

    const getWasteAnalysis = async (startDate, endDate) => {
        return await apiCall('waste', { startDate, endDate });
    };

    const getTopWastedIngredients = async (limit = 10) => {
        return await apiCall('top-wasted-ingredients', { limit });
    };

    const getLowStockItems = async (threshold) => {
        return await apiCall('low-stock-items', { threshold });
    };

    const getRevenueVsWaste = async (startDate, endDate) => {
        return await apiCall('revenue-vs-waste', { startDate, endDate });
    };

    const getForecastDemand = async (itemId, days = 30) => {
        return await apiCall('forecast-demand', { itemId, days });
    };

    const value = {
        loading,
        error,
        getSalesByDateRange,
        getTopSellingDishes,
        getLeastSellingDishes,
        getWasteAnalysis,
        getTopWastedIngredients,
        getLowStockItems,
        getRevenueVsWaste,
        getForecastDemand
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
