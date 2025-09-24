import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    plan: { type: String, enum: ['monthly'], default: 'monthly' },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    autoRenew: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'expired', 'canceled'], default: 'active', index: true },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;

