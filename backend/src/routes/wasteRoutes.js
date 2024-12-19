import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
const router = Router();

// ===================== Waste Routes =====================
router.post('waste/add-report',verifyToken, );
router.get('waste/get-reports',verifyToken, );
router.delete('waste/delete-report',verifyToken, );

export default router;
