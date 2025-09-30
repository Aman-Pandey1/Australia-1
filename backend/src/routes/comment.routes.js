const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/', requireAuth, body('listing').isMongoId(), body('content').isLength({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const comment = await Comment.create({ ...req.body, author: req.user.id });
  res.status(201).json({ comment });
});

router.get('/', async (req, res) => {
  const { listing } = req.query;
  const filter = { isDeleted: false };
  if (listing) filter.listing = listing;
  const items = await Comment.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

module.exports = router;

