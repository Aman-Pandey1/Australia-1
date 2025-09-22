import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
	},
	{ timestamps: true }
);

FavoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', FavoriteSchema);

