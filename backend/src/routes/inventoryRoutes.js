import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
import {
    getInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} from '../controllers/inventoryController.js';

const router = Router();


// ===================== Inventory Routes =====================
router.get('/get-items',verifyToken, getInventoryItems );
router.post('/add-item ',verifyToken, addInventoryItem);
router.put('/update-item',verifyToken,updateInventoryItem );
router.delete('/delete-item',verifyToken, deleteInventoryItem);

export default router;
