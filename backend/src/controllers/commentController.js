import { validationResult } from 'express-validator';
import { Comment } from '../models/Comment.js';

export async function addComment(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const { listing, content } = req.body;
	const comment = await Comment.create({ listing, content, author: req.user.id });
	return res.status(201).json({ comment });
}

export async function listListingComments(req, res) {
	const { listingId } = req.params;
	const comments = await Comment.find({ listing: listingId, status: 'approved' }).sort({ createdAt: -1 });
	return res.json({ comments });
}

