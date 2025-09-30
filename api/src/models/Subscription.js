import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["monthly", "quarterly", "semiannual", "annual"], required: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

