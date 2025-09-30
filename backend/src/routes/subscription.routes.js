const express = require('express');
const { body, validationResult } = require('express-validator');
const dayjs = require('dayjs');
const { requireAuth } = require('../middleware/auth');
const Subscription = require('../models/Subscription');

const PLAN_PRICE = { '1m': 10, '3m': 25, '6m': 45, '12m': 80 };

const router = express.Router();

router.post('/', requireAuth, body('plan').isIn(['1m', '3m', '6m', '12m']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { plan } = req.body;
  const months = Number(plan.replace('m', ''));
  const now = dayjs();
  const expiresAt = now.add(months, 'month').toDate();
  const sub = await Subscription.create({ user: req.user.id, plan, price: PLAN_PRICE[plan], startedAt: now.toDate(), expiresAt });
  res.status(201).json({ subscription: sub });
});

router.get('/me', requireAuth, async (req, res) => {
  const sub = await Subscription.findOne({ user: req.user.id, active: true }).sort({ createdAt: -1 });
  if (!sub) return res.json({ subscription: null, remainingDays: 0 });
  const remainingDays = Math.max(0, Math.ceil((sub.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  res.json({ subscription: sub, remainingDays });
});

module.exports = router;

