import { Router } from 'express';
import authRoutes from './auth.js';
import listingRoutes from './listings.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/admin', adminRoutes);

export default router;

