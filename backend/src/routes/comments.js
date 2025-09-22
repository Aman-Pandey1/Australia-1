import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { addComment, listListingComments } from '../controllers/commentController.js';

const router = Router();

router.get('/listing/:listingId', listListingComments);
router.post('/', authenticate, body('listing').notEmpty(), body('content').isLength({ min: 2 }), addComment);

export default router;

