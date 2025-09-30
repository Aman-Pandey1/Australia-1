import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

