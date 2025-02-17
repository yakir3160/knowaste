import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getInventoryItems,
    addOrUpdateInventoryItem,
    deleteInventoryItem,
    addNewOrder,
    getInventoryAnalytics,
    getWasteAnalytics,
    getOrderRecommendations,
    generateRecommendations
} from '../controllers/inventoryController.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// ===================== Inventory Routes =====================
router.get('/', getInventoryItems);
router.post('/', addOrUpdateInventoryItem);
router.post('/add_order/:id', addNewOrder);
router.delete('/:id', deleteInventoryItem);
router.get('/analytics/sales/:timeRange', getInventoryAnalytics);
router.get('/analytics/waste', getWasteAnalytics);
router.get('/analytics/recommendations/order', getOrderRecommendations);
router.get('/analytics/recommendations/item', generateRecommendations);


export default router;