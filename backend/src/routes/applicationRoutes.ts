import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect all application endpoints
router.use(authenticateToken);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
