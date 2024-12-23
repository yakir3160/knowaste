import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getInventoryItems,
    addOrUpdateInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} from '../controllers/inventoryController.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// ===================== Inventory Routes =====================
router.get('/', getInventoryItems);
router.post('/', addOrUpdateInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;