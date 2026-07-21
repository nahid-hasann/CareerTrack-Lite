import { Router } from 'express';
import { analyzeJobDescription } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect AI route with JWT authentication
router.use(authenticateToken);

router.post('/analyze-job', analyzeJobDescription);

export default router;
