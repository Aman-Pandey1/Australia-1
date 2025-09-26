import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    adminApproveListing,
    cityListings,
    createListing,
    getListing,
    myListings,
    updateListing,
    homepageSections,
    categoryListings,
    promoteListing,
} from '../controllers/listingController.js';

const router = Router();

// File uploads (images)
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'backend', 'uploads')),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/city/:city', cityListings);
router.get('/category/:category', categoryListings);
router.get('/slug/:slug', getListing);
router.get('/home/sections', homepageSections);

router.get('/me', authenticate, myListings);

router.post(
	'/',
    authenticate,
    upload.array('images', 8),
    body('title').notEmpty(),
    createListing
);

router.put('/:id', authenticate, updateListing);
router.patch('/:id/approve', authenticate, authorize('admin'), adminApproveListing);

// Allow user with active subscription to promote their own listing to VIP (homepage)
router.post('/:id/promote', authenticate, promoteListing);

export default router;

