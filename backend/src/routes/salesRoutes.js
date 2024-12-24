import { Router } from 'express';
import {verifyToken} from "../middleware/authMiddleware.js";
import {addSalesReport, getSalesReports, deleteSalesReport} from '../controllers/salesController.js';

const router = Router();

// ===================== Sales Routes =====================
router.post('/add-report',verifyToken,addSalesReport );
router.get('/get-reports',verifyToken,getSalesReports );
router.delete('/delete-report/:id', verifyToken, deleteSalesReport);

export default router;