const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const Report = require('../models/Report');

const router = express.Router();

router.post('/', requireAuth, body('listing').isMongoId(), body('reason').isLength({ min: 5 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const report = await Report.create({ listing: req.body.listing, reporter: req.user.id, reason: req.body.reason });
  res.status(201).json({ report });
});

router.get('/', requireAuth, requireRole('admin'), async (_req, res) => {
  const items = await Report.find().sort({ createdAt: -1 });
  res.json({ items });
});

router.post('/:id/status', requireAuth, requireRole('admin'), body('status').isIn(['open', 'reviewing', 'closed']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!report) return res.status(404).json({ message: 'Not found' });
  res.json({ report });
});

module.exports = router;

