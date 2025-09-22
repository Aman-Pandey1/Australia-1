import { Favorite } from '../models/Favorite.js';

export async function addFavorite(req, res) {
	const { listingId } = req.body;
	const fav = await Favorite.findOneAndUpdate(
		{ user: req.user.id, listing: listingId },
		{ user: req.user.id, listing: listingId },
		{ upsert: true, new: true }
	);
	return res.status(201).json({ favorite: fav });
}

export async function removeFavorite(req, res) {
	const { listingId } = req.params;
	await Favorite.findOneAndDelete({ user: req.user.id, listing: listingId });
	return res.json({ message: 'Removed' });
}

export async function myFavorites(req, res) {
	const items = await Favorite.find({ user: req.user.id }).populate('listing');
	return res.json({ favorites: items });
}

