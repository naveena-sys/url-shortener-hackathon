import { Router } from 'express';
import {
  getUrlAnalytics,
  getOverview,
} from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Order matters: /overview must come before /:id
router.get('/overview', getOverview);
router.get('/:id',      getUrlAnalytics);

export default router;