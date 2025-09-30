const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth, requireRole } = require('../middleware/auth');
const Listing = require('../models/Listing');

const router = express.Router();

// Create listing (provider)
router.post(
  '/',
  requireAuth,
  body('title').isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const listing = await Listing.create({ ...req.body, owner: req.user.id, status: 'pending' });
    res.status(201).json({ listing });
  }
);

// Update listing (owner or admin)
router.put('/:id', requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Not found' });
  if (String(listing.owner) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(listing, req.body);
  await listing.save();
  res.json({ listing });
});

// Approve listing (admin)
router.post('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Not found' });
  listing.status = 'approved';
  await listing.save();
  res.json({ listing });
});

// Delete (soft)
router.delete('/:id', requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Not found' });
  if (String(listing.owner) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  listing.isDeleted = true;
  await listing.save();
  res.json({ ok: true });
});

// Get listing by id
router.get('/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing || listing.isDeleted) return res.status(404).json({ message: 'Not found' });
  res.json({ listing });
});

// Query listings
router.get('/', async (req, res) => {
  const { city, country, status = 'approved', q, page = 1, pageSize = 20 } = req.query;
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (city) filter['contact.city'] = city;
  if (country) filter['contact.country'] = country;
  if (q) filter.title = { $regex: String(q), $options: 'i' };
  const skip = (Number(page) - 1) * Number(pageSize);
  const [items, total] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(pageSize)),
    Listing.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pageSize: Number(pageSize) });
});

module.exports = router;

