import dayjs from 'dayjs';
import { AdPurchase } from '../models/AdPurchase.js';

export async function createAdPurchase(req, res) {
	const { listingId, type, cities = [], priceUsd } = req.body;
	const ad = await AdPurchase.create({ listing: listingId, buyer: req.user.id, type, cities, priceUsd, status: 'pending' });
	return res.status(201).json({ ad });
}

export async function myAds(req, res) {
	const ads = await AdPurchase.find({ buyer: req.user.id }).sort({ createdAt: -1 });
	return res.json({ ads });
}

export async function activeHomepageAds(_req, res) {
	const now = dayjs().toDate();
	const ads = await AdPurchase.find({ status: 'approved', type: 'homepage', startsAt: { $lte: now }, expiresAt: { $gte: now } }).populate('listing', 'title slug photos');
	return res.json({ ads });
}

