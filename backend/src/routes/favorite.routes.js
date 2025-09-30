const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');

const router = express.Router();

router.post('/:listingId', requireAuth, async (req, res) => {
  const { listingId } = req.params;
  const favorite = await Favorite.findOneAndUpdate(
    { user: req.user.id, listing: listingId },
    { $setOnInsert: { user: req.user.id, listing: listingId } },
    { new: true, upsert: true }
  );
  await Listing.findByIdAndUpdate(listingId, { $inc: { favoritesCount: 1 } });
  res.status(201).json({ favorite });
});

router.delete('/:listingId', requireAuth, async (req, res) => {
  const { listingId } = req.params;
  const deleted = await Favorite.findOneAndDelete({ user: req.user.id, listing: listingId });
  if (deleted) await Listing.findByIdAndUpdate(listingId, { $inc: { favoritesCount: -1 } });
  res.json({ ok: true });
});

router.get('/', requireAuth, async (req, res) => {
  const items = await Favorite.find({ user: req.user.id }).populate('listing');
  res.json({ items });
});

module.exports = router;

