import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import menuRoutes from './menuRoutes.js';
import reportRoutes from "./reportRoutes.js";
import emailRoutes from './emailRoutes.js';



const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/menu', menuRoutes);
router.use('/reports', reportRoutes);
router.use('/email', emailRoutes);


export default router;