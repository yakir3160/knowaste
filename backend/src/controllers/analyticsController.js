import AnalyticsService from "../services/analyticsService.js";

export const getSalesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user.id;
        const result = await AnalyticsService.fetchSalesByDateRange(userId, startDate, endDate);
        res.json(result);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getTopSellingDishes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const result = await AnalyticsService.calculateTopSellingDishes(userId,startDate, endDate);
        res.json(result);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getLeastSellingDishes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const result = await AnalyticsService.calculateLeastSellingDishes(userId, startDate, endDate);
        res.json(result);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

export const getWasteAnalysis = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const result = await AnalyticsService.analyzeWaste(userId, startDate, endDate);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getTopWastedIngredients = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AnalyticsService.fetchTopWastedIngredients(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getNonProfitableItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AnalyticsService.fetchNonProfitableItems(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getLowStockItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AnalyticsService.fetchLowStockItems(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getRevenueVsWaste = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const result = await AnalyticsService.calculateRevenueVsWaste(userId, startDate, endDate);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getForecastDemand = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AnalyticsService.forecastDemand(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};