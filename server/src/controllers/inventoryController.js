import InventoryService from "../services/inventoryService.js";
import AnalyticsService from "../services/analyticsService.js";

export const addOrUpdateInventoryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const  ingredientData  = req.body;
        const result = await InventoryService.addOrUpdateInventoryItem(userId,ingredientData);
        if (!result.success) {
            throw {
                status: 500,
                message: result.error
            };
        }
        res.status(200).json({
            success: true,
            data: result,
            error: "Inventory item added successfully"
        });
    } catch (error) {
        console.error("Add inventory item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding inventory item"
        });
    }
}
export const addNewOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const  ingredientId  = req.params.id;
        const  orderData  = req.body;
        const result = await InventoryService.addNewOrder(userId,ingredientId,orderData);
        if (!result.success) {
            throw {
                status: 500,
                message: result.error
            };
        }
        res.status(200).json({
            success: true,
            data: result,
            error: "Order added successfully"
        });
    } catch (error) {
        console.error("Add order error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding order"
        });
    }
}
export const getInventoryItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await InventoryService.getInventoryItems(userId);
        res.status(200).json({
            success: true,
            data : result.data,
            categories: result.categories,
        });
    } catch (error) {
        console.error("Get inventory items error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching inventory items"
        });
    }
}
export const deleteInventoryItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const inventoryItemId  = req.params.id;
        const result = await InventoryService.deleteInventoryItem(userId,inventoryItemId);
        if (!result) {
            throw {
                status: 500,
                message: "Failed to delete inventory item"
            };
        }
        res.status(200).json({
            success: true,
            data: result,
            error: "Inventory item deleted successfully"
        });
    } catch (error) {
        console.error("Delete inventory item error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting inventory item"
        });
    }
}

export const getInventoryAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeRange } = req.params;
        const result = await AnalyticsService.calculateSalesAnalytics(userId,timeRange);

        res.status(200).json(result);
    } catch (error) {
        console.error("Get inventory analytics error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching inventory analytics"
        });
    }
}

export const getWasteAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const timeRange = req.query.timeRange || 'monthly';
        const result = await AnalyticsService.analyzeWaste(userId,timeRange);

        res.status(200).json(result);
    } catch (error) {
        console.error("Get waste analytics error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching waste analytics"
        });
    }
}

export const getOrderRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AnalyticsService.generateOrderRecommendations(userId);

        res.status(200).json(result);
    } catch (error) {
        console.error("Get order recommendations error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching order recommendations"
        });
    }
}

export const generateRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { averageDailyUsage, daysToOrder, safetyStock, address, city } = req.query;

        if (!averageDailyUsage || !daysToOrder || !safetyStock || !address || !city) {
            return res.status(400).json({
                success: false,
                error: "Missing required query parameters: averageDailyUsage, daysToOrder, safetyStock, address, and city are required."
            });
        }

        const result = await AnalyticsService.generateRecommendations(
            userId,
            parseFloat(averageDailyUsage),
            parseInt(daysToOrder),
            parseFloat(safetyStock),
            address,
            city
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("Generate recommendations error:", error.message);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error generating recommendations"
        });
    }
};
