import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { login, me, register, logout } from '../controllers/authController.js';

const router = Router();

router.post(
    '/register',
    body('email').isEmail().withMessage('Valid email required').trim().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isString().trim().isLength({ min: 0, max: 120 }),
    body('accountType').optional().isIn(['user', 'agent']).withMessage('Invalid account type'),
    register
);

router.post('/login', body('email').isEmail(), body('password').notEmpty(), login);

router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

export default router;

