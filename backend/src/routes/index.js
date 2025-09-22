import { Router } from 'express';
import authRoutes from './auth.js';
import listingRoutes from './listings.js';
import adminRoutes from './admin.js';
import reviewRoutes from './reviews.js';
import commentRoutes from './comments.js';
import favoriteRoutes from './favorites.js';
import reportRoutes from './reports.js';
import subscriptionRoutes from './subscriptions.js';
import adRoutes from './ads.js';
import contentRoutes from './content.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);
router.use('/comments', commentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reports', reportRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/ads', adRoutes);
router.use('/content', contentRoutes);

export default router;

