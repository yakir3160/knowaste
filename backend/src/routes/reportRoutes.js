import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {validateReportType} from '../middleware/reportsMiddleware.js';
import { addReport, getReports, deleteReport } from '../controllers/reportController.js';

const router = Router();

router.post('/:reportType',validateReportType, verifyToken, addReport);
router.get('/:reportType/:userId',validateReportType, verifyToken, getReports);
router.delete('/:reportType/:userId/:reportId',validateReportType, verifyToken, deleteReport);

export default router;
