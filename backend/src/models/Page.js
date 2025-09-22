import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, index: true },
		description: { type: String, default: '' },
		content: { type: String, default: '' },
		metaTitle: { type: String, default: '' },
		metaDescription: { type: String, default: '' },
	},
	{ timestamps: true }
);

export const Page = mongoose.model('Page', PageSchema);

