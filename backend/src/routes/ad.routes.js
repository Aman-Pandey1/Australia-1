const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const Ad = require('../models/Ad');

const PRICES = { city: 10, 'multi-city': 20, homepage: 30 };

const router = express.Router();

router.post('/', requireAuth, body('type').isIn(['city', 'multi-city', 'homepage']), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { listing, type, cities = [] } = req.body;
  const ad = await Ad.create({ listing, type, cities, price: PRICES[type] });
  res.status(201).json({ ad });
});

router.get('/', async (req, res) => {
  const { city, type } = req.query;
  const filter = { active: true };
  if (type) filter.type = type;
  if (city) filter.cities = city;
  const items = await Ad.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

module.exports = router;

