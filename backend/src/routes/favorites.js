import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { addFavorite, removeFavorite, myFavorites } from '../controllers/favoriteController.js';

const router = Router();

router.get('/me', authenticate, myFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/:listingId', authenticate, removeFavorite);

export default router;

