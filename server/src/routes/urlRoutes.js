import { Router } from 'express';
import { body } from 'express-validator';
import {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  getQRCode,
} from '../controllers/urlController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';

const router = Router();

// All URL management routes require authentication
router.use(authMiddleware);

const createUrlRules = [
  body('longUrl')
    .trim()
    .notEmpty().withMessage('URL is required.')
    .isURL({ require_protocol: true })
    .withMessage('Please provide a valid URL (must start with http:// or https://).'),
  body('customAlias')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Custom alias must be between 3 and 30 characters.')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage(
      'Alias may only contain letters, numbers, hyphens, and underscores.'
    ),
  body('expiresAt')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date string.'),
];

router.post('/',        createUrlRules, validate, createUrl);
router.get('/',         getUrls);
router.get('/:id',      getUrl);
router.patch('/:id',    updateUrl);
router.delete('/:id',   deleteUrl);
router.get('/:id/qr',   getQRCode);

export default router;