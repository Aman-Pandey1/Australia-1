const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'reviewing', 'closed'], default: 'open', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
