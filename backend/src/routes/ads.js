import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { createAdPurchase, myAds, activeHomepageAds } from '../controllers/adController.js';

const router = Router();

router.get('/homepage/active', activeHomepageAds);
router.get('/me', authenticate, myAds);
router.post('/', authenticate, createAdPurchase);

export default router;

