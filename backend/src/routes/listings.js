import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import {
	adminApproveListing,
	cityListings,
	createListing,
	getListing,
	myListings,
	updateListing,
} from '../controllers/listingController.js';

const router = Router();

router.get('/city/:city', cityListings);
router.get('/slug/:slug', getListing);

router.get('/me', authenticate, myListings);

router.post(
	'/',
	authenticate,
	body('title').notEmpty(),
	createListing
);

router.put('/:id', authenticate, updateListing);
router.patch('/:id/approve', authenticate, authorize('admin'), adminApproveListing);

export default router;

