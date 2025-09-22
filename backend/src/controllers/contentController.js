import { Post } from '../models/Post.js';
import { Page } from '../models/Page.js';

export async function publicPosts(_req, res) {
	const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
	return res.json({ posts });
}

export async function publicPost(req, res) {
	const { slug } = req.params;
	const post = await Post.findOne({ slug, status: 'published' });
	if (!post) return res.status(404).json({ message: 'Not found' });
	return res.json({ post });
}

export async function publicPage(req, res) {
	const { slug } = req.params;
	const page = await Page.findOne({ slug });
	if (!page) return res.status(404).json({ message: 'Not found' });
	return res.json({ page });
}

