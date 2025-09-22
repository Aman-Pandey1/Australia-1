import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		content: { type: String, required: true },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
	},
	{ timestamps: true }
);

export const Comment = mongoose.model('Comment', CommentSchema);

