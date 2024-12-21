import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    getMenuCategories,
    getMenuItemsByCategory
} from '../controllers/menuController.js';

const router = Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// ===================== Menu Routes =====================
router.get('/categories', getMenuCategories);
router.get('/items-by-category', getMenuItemsByCategory);
router.get('/items', getMenuItems);
router.post('/item', addMenuItem);
router.put('/item', updateMenuItem);
router.delete('/item', deleteMenuItem);

export default router;