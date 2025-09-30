import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

