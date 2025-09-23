import dayjs from 'dayjs';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Review } from '../models/Review.js';
import { Comment } from '../models/Comment.js';
import { Report } from '../models/Report.js';
import { Subscription } from '../models/Subscription.js';
import { AdPurchase } from '../models/AdPurchase.js';
import { Post } from '../models/Post.js';
import { Page } from '../models/Page.js';
import { Setting } from '../models/Setting.js';
import { sendEmail } from '../utils/email.js';

export async function dashboardSummary(_req, res) {
	const [users, listingsPending, listingsApproved, reviewsPending, commentsPending, reportsPending, adsPending, subsActive] =
		await Promise.all([
			User.countDocuments({}),
			Listing.countDocuments({ status: 'pending' }),
			Listing.countDocuments({ status: 'approved' }),
			Review.countDocuments({ status: 'pending' }),
			Comment.countDocuments({ status: 'pending' }),
			Report.countDocuments({ status: 'pending' }),
			AdPurchase.countDocuments({ status: 'pending' }),
			Subscription.countDocuments({ status: 'active' }),
		]);
	return res.json({ users, listingsPending, listingsApproved, reviewsPending, commentsPending, reportsPending, adsPending, subsActive });
}

// Users
export async function listUsers(req, res) {
	const { q = '', role } = req.query;
	const where = {};
	if (q) where.$or = [{ email: new RegExp(String(q), 'i') }, { name: new RegExp(String(q), 'i') }];
	if (role) where.role = role;
	const users = await User.find(where).sort({ createdAt: -1 }).limit(200).select('-passwordHash');
	return res.json({ users });
}

export async function setUserRole(req, res) {
	const { id } = req.params;
	const { role } = req.body; // 'user' | 'admin'
	const user = await User.findById(id);
	if (!user) return res.status(404).json({ message: 'Not found' });
	user.role = role;
	await user.save();
	return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}

// Listings
export async function listListings(req, res) {
	const { status, city } = req.query;
	const where = {};
	if (status) where.status = status;
	if (city) where['contact.city'] = city;
	const listings = await Listing.find(where).sort({ createdAt: -1 }).limit(300);
	return res.json({ listings });
}

export async function setListingStatus(req, res) {
	const { id } = req.params;
	const { status } = req.body; // approved | rejected | pending
    const listing = await Listing.findById(id).populate('owner', 'email name');
	if (!listing) return res.status(404).json({ message: 'Not found' });
	listing.status = status;
	await listing.save();
    try {
        const ownerEmail = listing?.owner?.email;
        if (ownerEmail) {
            const subject = status === 'approved' ? 'Your listing has been approved' : (status === 'rejected' ? 'Your listing was rejected' : 'Listing status updated');
            const html = `<p>Hi ${listing?.owner?.name || ''},</p><p>Your listing <strong>${listing.title}</strong> status is now <strong>${status}</strong>.</p>`;
            await sendEmail({ to: ownerEmail, subject, html });
        }
    } catch {}
	return res.json({ listing });
}

export async function deleteListing(req, res) {
	const { id } = req.params;
	await Listing.findByIdAndDelete(id);
	return res.json({ message: 'Deleted' });
}

// Moderation: reviews/comments
export async function listReviews(req, res) {
	const { status } = req.query;
	const where = {};
	if (status) where.status = status;
	const reviews = await Review.find(where).sort({ createdAt: -1 }).limit(300);
	return res.json({ reviews });
}

export async function setReviewStatus(req, res) {
	const { id } = req.params;
	const { status } = req.body;
	const review = await Review.findById(id);
	if (!review) return res.status(404).json({ message: 'Not found' });
	review.status = status;
	await review.save();
	return res.json({ review });
}

export async function listComments(req, res) {
	const { status } = req.query;
	const where = {};
	if (status) where.status = status;
	const comments = await Comment.find(where).sort({ createdAt: -1 }).limit(300);
	return res.json({ comments });
}

export async function setCommentStatus(req, res) {
	const { id } = req.params;
	const { status } = req.body;
	const comment = await Comment.findById(id);
	if (!comment) return res.status(404).json({ message: 'Not found' });
	comment.status = status;
	await comment.save();
	return res.json({ comment });
}

// Reports
export async function listReports(_req, res) {
	const reports = await Report.find({}).sort({ createdAt: -1 }).limit(300);
	return res.json({ reports });
}

export async function setReportStatus(req, res) {
	const { id } = req.params;
	const { status } = req.body; // resolved | dismissed
	const report = await Report.findById(id);
	if (!report) return res.status(404).json({ message: 'Not found' });
	report.status = status;
	await report.save();
	return res.json({ report });
}

// Subscriptions
export async function listSubscriptions(_req, res) {
	const subs = await Subscription.find({}).sort({ createdAt: -1 }).limit(300);
	return res.json({ subscriptions: subs });
}

export async function createSubscription(req, res) {
	const { userId, months = 1 } = req.body;
	const start = dayjs();
	const end = start.add(months, 'month');
	const sub = await Subscription.create({ user: userId, plan: 'monthly', startedAt: start.toDate(), expiresAt: end.toDate(), status: 'active' });
	return res.status(201).json({ subscription: sub });
}

export async function cancelSubscription(req, res) {
	const { id } = req.params;
	const sub = await Subscription.findById(id);
	if (!sub) return res.status(404).json({ message: 'Not found' });
	sub.status = 'canceled';
	await sub.save();
	return res.json({ subscription: sub });
}

// Ads
export async function listAds(_req, res) {
	const ads = await AdPurchase.find({}).sort({ createdAt: -1 }).limit(300).populate('listing', 'title');
	return res.json({ ads });
}

export async function setAdStatus(req, res) {
	const { id } = req.params;
	const { status } = req.body; // approved | rejected
    const ad = await AdPurchase.findById(id).populate('buyer', 'email name').populate('listing', 'title');
	if (!ad) return res.status(404).json({ message: 'Not found' });
	ad.status = status;
	if (status === 'approved') {
		const now = dayjs();
		ad.startsAt = now.toDate();
		ad.expiresAt = now.add(30, 'day').toDate();
		// Update listing premium according to ad type
        const listing = await Listing.findById(ad.listing);
		if (listing) {
			listing.premium = listing.premium || {};
			if (ad.type === 'homepage') {
				listing.premium.level = 'vip';
				listing.premium.showOnHomepage = true;
			}
			if (ad.type === 'city') {
				listing.premium.level = 'featured';
				listing.premium.cities = ad.cities || listing.premium.cities || [];
			}
			if (ad.type === 'multi_city') {
				listing.premium.level = 'premium';
				listing.premium.cities = ad.cities || listing.premium.cities || [];
			}
			listing.premium.startsAt = ad.startsAt;
			listing.premium.expiresAt = ad.expiresAt;
			await listing.save();
		}
	}
	await ad.save();
    try {
        const buyerEmail = ad?.buyer?.email;
        if (buyerEmail) {
            const subject = status === 'approved' ? 'Your ad purchase was approved' : (status === 'rejected' ? 'Your ad purchase was rejected' : 'Ad status updated');
            const html = `<p>Hi ${ad?.buyer?.name || ''},</p><p>Your ad for <strong>${ad?.listing?.title || ad.listing}</strong> is now <strong>${status}</strong>.</p>`;
            await sendEmail({ to: buyerEmail, subject, html });
        }
    } catch {}
	return res.json({ ad });
}

// Posts & Pages
export async function listPosts(_req, res) {
	const posts = await Post.find({}).sort({ createdAt: -1 }).limit(300);
	return res.json({ posts });
}

export async function upsertPost(req, res) {
	const { id } = req.params;
	const payload = req.body;
	const post = id ? await Post.findByIdAndUpdate(id, payload, { new: true }) : await Post.create(payload);
	return res.json({ post });
}

export async function deletePost(req, res) {
	const { id } = req.params;
	await Post.findByIdAndDelete(id);
	return res.json({ message: 'Deleted' });
}

export async function listPages(_req, res) {
	const pages = await Page.find({}).sort({ createdAt: -1 }).limit(300);
	return res.json({ pages });
}

export async function upsertPage(req, res) {
	const { id } = req.params;
	const payload = req.body;
	const page = id ? await Page.findByIdAndUpdate(id, payload, { new: true }) : await Page.create(payload);
	return res.json({ page });
}

export async function deletePage(req, res) {
	const { id } = req.params;
	await Page.findByIdAndDelete(id);
	return res.json({ message: 'Deleted' });
}

// Settings
export async function getSettings(_req, res) {
	const docs = await Setting.find({});
	const settings = docs.reduce((acc, cur) => {
		acc[cur.key] = cur.value;
		return acc;
	}, {});
	return res.json({ settings });
}

export async function setSettings(req, res) {
	const entries = Object.entries(req.body || {});
	await Promise.all(
		entries.map(([key, value]) => Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true }))
	);
	return res.json({ message: 'Saved' });
}

