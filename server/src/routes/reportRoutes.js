import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    addReport,
    getReports,
    deleteReport,
    updateReportStatus
} from '../controllers/reportController.js';

const router = Router();

router.post('/:type/add', verifyToken, addReport);
router.get('/:type/list', verifyToken, getReports);
router.delete('/:type/:id', verifyToken, deleteReport);
router.put('/:type/:id/status', verifyToken, updateReportStatus);

export default router;