import mongoose from 'mongoose';
import slugify from 'slugify';

const ContactSchema = new mongoose.Schema(
  {
    city: { type: String, index: true },
    country: { type: String, index: true },
    address: { type: String },
    phone: String,
    whatsapp: String,
    telegram: String,
  },
  { _id: false }
);

const StatsSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ['female', 'male', 'trans', 'other'] },
    age: Number,
    height: String,
    weight: String,
    measurements: String,
    ethnicity: String,
    hair: String,
    eyes: String,
  },
  { _id: false }
);

const PremiumSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['none', 'featured', 'vip', 'premium'], default: 'none', index: true },
    startsAt: Date,
    expiresAt: Date,
    cities: [{ type: String, index: true }],
    showOnHomepage: { type: Boolean, default: false },
  },
  { _id: false }
);

const ListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    photos: [{ type: String }],
    price: { type: Number, min: 0 },
    categories: [{ type: String, index: true }],
    contact: ContactSchema,
    stats: StatsSchema,
    premium: PremiumSchema,
    views: { type: Number, default: 0, index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  },
  { timestamps: true }
);

ListingSchema.pre('save', function preSave(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Listing = mongoose.model('Listing', ListingSchema);
export default Listing;

