import { validationResult } from 'express-validator';
import { Review } from '../models/Review.js';

export async function addReview(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { listing, rating, content } = req.body;
	const review = await Review.create({ listing, rating, content, author: req.user.id });
	return res.status(201).json({ review });
}

export async function listListingReviews(req, res) {
	const { listingId } = req.params;
	const reviews = await Review.find({ listing: listingId, status: 'approved' }).sort({ createdAt: -1 });
	return res.json({ reviews });
}

