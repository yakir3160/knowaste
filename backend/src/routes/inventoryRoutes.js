import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} from '../controllers/inventoryController.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// ===================== Inventory Routes =====================
router.get('/items', getInventoryItems);
router.post('/item', addInventoryItem);
router.put('/item', updateInventoryItem);
router.delete('/item', deleteInventoryItem);

export default router;