import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
	{
		listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		rating: { type: Number, min: 1, max: 5, required: true },
		content: { type: String, default: '' },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
	},
	{ timestamps: true }
);

export const Review = mongoose.model('Review', ReviewSchema);

