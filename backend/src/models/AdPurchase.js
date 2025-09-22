import mongoose from 'mongoose';

const AdPurchaseSchema = new mongoose.Schema(
	{
		listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
		buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		type: { type: String, enum: ['city', 'multi_city', 'homepage'], required: true, index: true },
		cities: [{ type: String }],
		priceUsd: { type: Number, required: true },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
		startsAt: { type: Date },
		expiresAt: { type: Date },
	},
	{ timestamps: true }
);

export const AdPurchase = mongoose.model('AdPurchase', AdPurchaseSchema);

