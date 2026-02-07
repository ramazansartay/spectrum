
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adRoutes from './ads.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ads', adRoutes);

export default router;
