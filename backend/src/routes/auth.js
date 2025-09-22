import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { login, me, register, logout } from '../controllers/authController.js';

const router = Router();

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isLength({ min: 6 }),
	register
);

router.post('/login', body('email').isEmail(), body('password').notEmpty(), login);

router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);

export default router;

