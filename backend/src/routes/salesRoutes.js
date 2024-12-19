import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
const router = Router();

// ===================== Sales Routes =====================
router.post('sales/add-report',verifyToken, );
router.get('sales/get-reports',verifyToken, );
router.delete('sales/delete-report',verifyToken, );

export default router;