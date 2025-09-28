import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { login, me, register, logout, updateProfile } from '../controllers/authController.js';
import multer from 'multer';
import path from 'path';

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

// Profile update (supports multipart for avatar)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
router.patch('/profile', authenticate, upload.single('avatar'), updateProfile);

export default router;

