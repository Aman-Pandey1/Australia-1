import mongoose from "mongoose";

const ContactInfoSchema = new mongoose.Schema(
  {
    city: { type: String, index: true },
    country: { type: String, index: true },
    phone: String,
    whatsapp: String,
    telegram: String,
    webPage: String,
    instructions: String,
  },
  { _id: false }
);

const PhysicalSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ["Female", "Male", "Trans", "Other"], index: true },
    sexualOrientation: { type: String },
    age: Number,
    location: String,
    eyes: String,
    hair: String,
    bust: String,
    pubicHair: String,
    outcall: String,
    languages: [String],
    ethnicity: String,
    nationality: String,
    heightCm: Number,
    weightKg: Number,
    smoking: String,
    drinking: String,
    tattoos: String,
    piercings: String,
    meetingWith: String,
    availableForCouples: { type: Boolean, default: false },
  },
  { _id: false }
);

const AdvertisingSchema = new mongoose.Schema(
  {
    premiumTier: { type: String, enum: ["none", "featured", "popular"], default: "none", index: true },
    cityWise: [String],
    multiCity: [String],
    homepageVip: { type: Boolean, default: false, index: true },
  },
  { _id: false }
);

const ListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true },
    bio: { type: String },
    photos: [String],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    contact: ContactInfoSchema,
    physical: PhysicalSchema,
    advertising: AdvertisingSchema,
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ListingSchema.index({ "contact.city": 1, status: 1 });
ListingSchema.index({ createdAt: -1 });

export const Listing = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

