import { Router } from 'express';
import {updateUserDetails} from '../controllers/userController.js';
import {verifyToken} from "../middleware/authMiddleware.js";
const router = Router();

// ===================== User Routes =====================
router.put('/update-profile',verifyToken, updateUserDetails);


export default router;
