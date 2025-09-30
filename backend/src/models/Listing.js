const mongoose = require('mongoose');

const ContactInfoSchema = new mongoose.Schema(
  {
    city: { type: String, index: true },
    country: { type: String, index: true },
    phone: String,
    apps: [{ type: String }], // WhatsApp, Telegram, etc
    website: String,
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ['Female', 'Male', 'Transgender', 'Non-binary', 'Other'], index: true },
    sexualOrientation: String,
    age: Number,
    location: String,
    eyes: String,
    hair: String,
    breasts: String,
    pubicHair: String,
    outcall: String,
    languages: [{ type: String }],
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
    premiumCity: { type: String, default: null },
    premiumMultiCities: [{ type: String }],
    homepageVip: { type: Boolean, default: false },
  },
  { _id: false }
);

const ListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    contact: { type: ContactInfoSchema, default: {} },
    profile: { type: ProfileSchema, default: {} },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    isDeleted: { type: Boolean, default: false },
    photos: [{ type: String }],
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    advertising: { type: AdvertisingSchema, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', ListingSchema);

