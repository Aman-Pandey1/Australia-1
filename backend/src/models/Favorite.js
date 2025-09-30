const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
