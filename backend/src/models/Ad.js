const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    type: { type: String, enum: ['city', 'multi-city', 'homepage'], required: true, index: true },
    cities: [{ type: String }],
    price: { type: Number, required: true },
    active: { type: Boolean, default: true, index: true },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', AdSchema);

