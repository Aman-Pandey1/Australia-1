import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import { createBlog, updateBlog, publishBlog, getBlogs, getBlogBySlug } from '../controllers/blogController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);

router.post('/', requireAuth, requireRole('admin'), upload.single('coverImage'), [body('title').notEmpty(), body('content').notEmpty()], createBlog);
router.put('/:id', requireAuth, requireRole('admin'), updateBlog);
router.post('/:id/publish', requireAuth, requireRole('admin'), publishBlog);

export default router;

