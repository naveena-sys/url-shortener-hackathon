import { Router } from 'express';
import { redirectUrl } from '../controllers/urlController.js';

const router = Router();

// Public — no authentication required
router.get('/:shortCode', redirectUrl);

export default router;