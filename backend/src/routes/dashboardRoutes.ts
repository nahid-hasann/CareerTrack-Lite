import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect all dashboard endpoints
router.use(authenticateToken);

router.get('/stats', getDashboardStats);

export default router;
