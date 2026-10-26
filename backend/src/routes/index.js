import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import itemRoutes from './itemRoutes.js';
import statsRoutes from './statsRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);

export default router;
