import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createReport, myReports } from '../controllers/reportController.js';

const router = Router();

router.get('/me', authenticate, myReports);
router.post('/', authenticate, body('listing').notEmpty(), body('reason').isLength({ min: 4 }), createReport);

export default router;

