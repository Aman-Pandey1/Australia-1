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

export async function contactSubmit(req, res) {
    const { name = '', email = '', message = '' } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' });
    // For demo: just log. In real app, send an email or store in DB.
    // eslint-disable-next-line no-console
    console.log('[contact] new message:', { name, email, message: message.slice(0, 200) });
    return res.json({ message: 'Thanks for contacting us. We will get back to you shortly.' });
}

