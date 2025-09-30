const express = require('express');
const Listing = require('../models/Listing');

const router = express.Router();

router.get('/', async (_req, res) => {
  const [featured, popular, newest] = await Promise.all([
    Listing.find({ isDeleted: false, status: 'approved', 'advertising.homepageVip': true }).sort({ updatedAt: -1 }).limit(12),
    Listing.find({ isDeleted: false, status: 'approved' }).sort({ favoritesCount: -1 }).limit(12),
    Listing.find({ isDeleted: false, status: 'approved' }).sort({ createdAt: -1 }).limit(12),
  ]);
  res.json({ featured, popular, newest });
});

module.exports = router;

