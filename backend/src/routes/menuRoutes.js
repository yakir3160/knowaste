import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
import {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    getMenuCategories,
    getMenuItemsByCategory
} from '../controllers/menuController.js';
const router = Router();
// ===================== Menu Routes =====================
router.get('/get-categories',verifyToken,getMenuCategories );
router.get ('/get-item-by-category',verifyToken,getMenuItemsByCategory);
router.get('/get-items',verifyToken,updateMenuItem );
router.post('/add-item',verifyToken,addMenuItem );
router.put('/update-item',verifyToken,getMenuItems);
router.delete('/delete-item',verifyToken,deleteMenuItem);

export default router;

