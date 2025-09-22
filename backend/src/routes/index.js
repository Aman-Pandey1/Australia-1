import { Router } from 'express';
import authRoutes from './auth.js';
import listingRoutes from './listings.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);

export default router;

