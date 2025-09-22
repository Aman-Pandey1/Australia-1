import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
	{
		listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
		reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		reason: { type: String, required: true },
		status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending', index: true },
	},
	{ timestamps: true }
);

export const Report = mongoose.model('Report', ReportSchema);

