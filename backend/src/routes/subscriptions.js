import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getMySubscription, rechargeSubscription } from '../controllers/subscriptionController.js';

const router = Router();

router.get('/me', authenticate, getMySubscription);
router.post('/recharge', authenticate, rechargeSubscription);

export default router;

