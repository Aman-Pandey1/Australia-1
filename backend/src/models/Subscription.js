const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, enum: ['1m', '3m', '6m', '12m'], required: true },
    price: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: true },
    emailNotified: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);
