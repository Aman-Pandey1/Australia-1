import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    type: { type: String, enum: ["city", "multi-city", "homepage"], required: true, index: true },
    cities: [String],
    priceUsd: { type: Number, default: 0 },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Advertisement = mongoose.models.Advertisement || mongoose.model("Advertisement", AdvertisementSchema);

