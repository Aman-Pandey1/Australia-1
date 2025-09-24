import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import {
  createListing,
  updateListing,
  approveListing,
  getListings,
  getHomeSections,
  getListingBySlug,
  deleteListing,
} from '../controllers/listingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const router = Router();

router.get('/home', getHomeSections);
router.get('/', getListings);
router.get('/slug/:slug', getListingBySlug);

router.post(
  '/',
  requireAuth,
  upload.array('images', 8),
  [body('title').notEmpty(), body('description').notEmpty()],
  createListing
);

router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);

router.post('/:id/approve', requireAuth, requireRole('admin'), approveListing);

export default router;

