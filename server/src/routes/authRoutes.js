import { Router } from 'express';
import { verifyToken} from "../middleware/authMiddleware.js";
import {
    register,
    login,
    googleSignIn,
    sendPasswordResetEmail,
    resetPassword,
    updatePasswordWithVerification,
    updateEmail,
} from '../controllers/authController.js'

const router = Router();
// ===================== Auth Routes =====================
router.post('/register', register)
router.post('/login', login)
router.post('/google', googleSignIn)
router.post('/reset-password', sendPasswordResetEmail)
router.post('/reset-password/confirm', resetPassword)
router.post('/update-password', updatePasswordWithVerification)
router.post('/update-email', updateEmail)

router.get('/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

export default router;