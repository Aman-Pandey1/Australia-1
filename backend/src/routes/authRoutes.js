import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { register, login, me, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);

router.get('/me', requireAuth, me);

// Profile update with optional avatar upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
router.patch('/profile', requireAuth, upload.single('avatar'), updateProfile);

export default router;

