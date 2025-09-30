const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    country: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', CitySchema);

