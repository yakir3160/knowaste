import { Router } from 'express';
import { verifyToken} from "../middleware/authMiddleware.js";
import {
    register,
    login,
    googleSignIn,
    sendPasswordResetEmail,
    resetPassword
} from '../controllers/authController.js'

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleSignIn)

router.post('/reset-password', sendPasswordResetEmail)
router.post('/reset-password/confirm', resetPassword)

router.get('/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

export default router;