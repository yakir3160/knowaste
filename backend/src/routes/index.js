import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import menuRoutes from './menuRoutes.js';
//import salesRoutes from "./salesRoutes.js";
//import wasteRoutes from "./wasteRoutes.js";
import reportRoutes from "./reportRoutes.js";


const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/menu', menuRoutes);
//router.use('/sales', salesRoutes);
//router.use('/waste', wasteRoutes);
router.use('/reports', reportRoutes);



export default router;