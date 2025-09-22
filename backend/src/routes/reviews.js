import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { addReview, listListingReviews } from '../controllers/reviewController.js';

const router = Router();

router.get('/listing/:listingId', listListingReviews);
router.post('/', authenticate, body('listing').notEmpty(), body('rating').isInt({ min: 1, max: 5 }), addReview);

export default router;

