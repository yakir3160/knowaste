import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
import {addWasteReport, getWasteReports, deleteWasteReport} from '../controllers/wasteController.js';
const router = Router();

// ===================== Waste Routes =====================
router.post('/add-report',verifyToken,addWasteReport );
router.get('/get-reports',verifyToken,getWasteReports );
router.delete('/delete-report/:id', verifyToken, deleteWasteReport);

export default router;
