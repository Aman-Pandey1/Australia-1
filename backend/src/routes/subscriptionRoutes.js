import { Router } from 'express';
import { getPlans, subscribe, mySubscription } from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getPlans);
router.get('/me', requireAuth, mySubscription);
router.post('/', requireAuth, subscribe);

export default router;

