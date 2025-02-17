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
        const result = await AnalyticsService.analyzeWaste(
            userId,
            startDate,
            endDate
        );
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
        const { startDate = new Date(), daysToForecast = 30 } = req.query;

        const parsedStartDate = new Date(startDate);
        const parsedDays = parseInt(daysToForecast);

        if (isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid start date provided'
            });
        }

        if (isNaN(parsedDays) || parsedDays <= 0 || parsedDays > 30) {
            return res.status(400).json({
                success: false,
                error: 'Days to forecast must be between 1 and 30'
            });
        }

        const result = await AnalyticsService.forecastDemand(
            userId,
            parsedStartDate,
            parsedDays
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getBatchAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Default to last 30 days if no dates provided
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Use provided dates if they exist
        const requestStartDate = req.query.startDate ? new Date(req.query.startDate) : startDate;
        const requestEndDate = req.query.endDate ? new Date(req.query.endDate) : endDate;

        // Validate dates
        if (isNaN(requestStartDate.getTime()) || isNaN(requestEndDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format'
            });
        }

        const results = await AnalyticsService.getBatchAnalytics(
            userId,
            requestStartDate.toISOString(),
            requestEndDate.toISOString()
        );

        res.json(results);
    } catch (error) {
        console.error('Batch analytics error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error fetching batch analytics'
        });
    }
};