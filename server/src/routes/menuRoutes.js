import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    addOrUpdateMenuItem,
    getMenuItems,
    deleteMenuItem,
    getMenuItemsByCategory
} from '../controllers/menuController.js';

const router = Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);


// Menu items routes
router.get('/', getMenuItems);
router.get('/items-by-category', getMenuItemsByCategory)
router.post('/', addOrUpdateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;