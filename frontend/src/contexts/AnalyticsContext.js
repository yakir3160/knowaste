import React, { createContext, useContext, useState } from 'react';
import { useUserContext } from "./UserContext";

const AnalyticsContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

export const AnalyticsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();
    const token = localStorage.getItem('authToken');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analyticsData, setAnalyticsData] = useState({
        salesData: [],
        popularDishesData: [],
        lowStockItems: [],
        wasteData: [],
        leastSellingDishesData: [],
        summaryData: {
            monthlySales: 0,
            monthlyWaste: 0,
            totalRevenue: 0,
            salesTrend: 0,
            wasteTrend: 0,
            revenueTrend: 0
        }
    });
    console.log('Sales data:', analyticsData.salesData);
    console.log('Popular dishes:', analyticsData.popularDishesData);
    console.log('Least selling dishes:', analyticsData.leastSellingDishesData);
    console.log('Low stock items:', analyticsData.lowStockItems);
    console.log('Waste data:', analyticsData.wasteData);

    const apiCall = async (endpoint, params = {}) => {
        try {
            setLoading(true);
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/api/analytics/${endpoint}${queryString ? `?${queryString}` : ''}`;
            console.log(url)

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

    const getAnalyticsData = async (startDate, endDate ) => {
        try {
            setLoading(true);


            const [salesData, popularDishesData, leastSellingDishesData, lowStockItems, wasteData] =
                await Promise.allSettled([
                    getSalesByDateRange(startDate, endDate ),
                    getTopSellingDishes(startDate, endDate ),
                    getLeastSellingDishes(startDate, endDate ),
                    getLowStockItems(startDate, endDate ),
                    getWasteAnalysis(startDate, endDate ),
                ]);


            // const salesTrend = salesData.length > 1 ?
            //     (salesData[0].total - salesData[1].total) / salesData[1].total * 100 : 0;
            // const wasteTrend = wasteData.length > 1 ?
            //     (wasteData[0].total - wasteData[1].total) / wasteData[1].total * 100 : 0;
            // const revenueTrend = salesTrend > 0 ?
            //     (salesData - salesData[1].total) / salesData[1].total * 100 : 0;

            setAnalyticsData({
                salesData : salesData.value.data,
                popularDishesData : popularDishesData.value.data,
                leastSellingDishesData: leastSellingDishesData.value.data ,
                lowStockItems: lowStockItems.value.data,
                wasteData: wasteData.value.data,
            });
        } catch (error) {
            setError('Error fetching analytics data');
            console.error('Error getting analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSalesByDateRange = async (startDate, endDate) => {
        return await apiCall('sales', { startDate, endDate });
    };

    const getTopSellingDishes = async (startDate, endDate ) => {
        return await apiCall('top-dishes' , { startDate, endDate  });
    };

    const getLeastSellingDishes = async (startDate, endDate ) => {
        return await apiCall('least-selling-dishes', { startDate, endDate  });
    };

    const getWasteAnalysis = async (startDate, endDate) => {
        return await apiCall('waste', { startDate, endDate });
    };

    const getTopWastedIngredients = async (startDate, endDate ) => {
        return await apiCall('top-wasted-ingredients', { startDate, endDate  });
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
        popularDishesData: analyticsData.popularDishesData,
        getAnalyticsData,
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
