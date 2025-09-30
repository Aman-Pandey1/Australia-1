const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  body('listing').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('content').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const review = await Review.create({ ...req.body, author: req.user.id });
    res.status(201).json({ review });
  }
);

router.get('/', async (req, res) => {
  const { listing } = req.query;
  const filter = { isDeleted: false };
  if (listing) filter.listing = listing;
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  res.json({ items: reviews });
});

module.exports = router;

