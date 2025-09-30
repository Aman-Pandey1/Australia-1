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
  { timestamps: true }
);

export const ContactInfo = mongoose.models.ContactInfo || mongoose.model("ContactInfo", ContactInfoSchema);

