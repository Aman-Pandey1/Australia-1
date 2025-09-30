import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    city: { type: String, index: true },
    country: { type: String, index: true },
  },
  { _id: false }
);

const ContactInfoSchema = new mongoose.Schema(
  {
    phone: String,
    whatsapp: String,
    telegram: String,
    webPage: String,
    instructions: String,
  },
  { _id: false }
);

const SubscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, enum: ["monthly", "quarterly", "semiannual", "annual"], required: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false, timestamps: false }
);

const FavoriteSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", index: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    address: AddressSchema,
    contact: ContactInfoSchema,
    favorites: [FavoriteSchema],
    subscription: SubscriptionSchema,
    emailVerifiedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ "address.city": 1 });
UserSchema.index({ email: 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

