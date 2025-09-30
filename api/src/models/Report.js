import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["fake", "other"], default: "fake" },
    reason: { type: String },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

