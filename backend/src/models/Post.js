import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, index: true },
		description: { type: String, default: '' },
		content: { type: String, default: '' },
		status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
		metaTitle: { type: String, default: '' },
		metaDescription: { type: String, default: '' },
	},
	{ timestamps: true }
);

export const Post = mongoose.model('Post', PostSchema);

