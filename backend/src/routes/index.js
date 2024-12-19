import { Router } from 'express';
import userRoutes from './userRoutes.js';
import salesRoutes from './salesRoutes.js';
import wasteRoutes from './wasteRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import menuRoutes from './menuRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/sales', salesRoutes);
router.use('/waste', wasteRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/menu', menuRoutes);

export default router;
