import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
const router = Router();
// ===================== Menu Routes =====================
router.get('menu/get-categories',verifyToken, );
router.get('menu/get-items',verifyToken, );
router.post('menu/add-item',verifyToken, );
router.put('menu/update-item',verifyToken, );
router.delete('menu/delete-item',verifyToken, );

export default router;

