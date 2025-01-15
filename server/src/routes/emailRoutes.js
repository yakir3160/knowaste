import { Router } from 'express';
import { sendContactEmail } from '../controllers/emailController.js';


const router = Router();
// ===================== Auth Routes =====================
router.post('/contact', sendContactEmail )


export default router;