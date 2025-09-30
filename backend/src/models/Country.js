const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Country', CountrySchema);

