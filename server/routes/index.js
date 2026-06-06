import { Router } from 'express';
import { getBackendStatus, getHome } from '../controllers/healthController.js';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/', getHome);
router.get('/api/test', getBackendStatus);
router.use('/api', authRoutes);
router.use('/api/courses', courseRoutes);
router.use('/api/departments', departmentRoutes);
router.use('/api/users', userRoutes);

export default router;
