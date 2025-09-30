const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    apps: [{ type: String }],
    website: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);

