import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
const router = Router();


// ===================== Inventory Routes =====================
router.get('inventory/get-products',verifyToken, );
router.post('inventory/add-product ',verifyToken, );
router.put('inventory/update-product',verifyToken, );
router.delete('inventory/delete-product',verifyToken, );

export default router;
