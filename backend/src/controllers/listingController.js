import { validationResult } from 'express-validator';
import dayjs from 'dayjs';
import { Listing } from '../models/Listing.js';

export async function createListing(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	const payload = {
		...req.body,
		owner: req.user.id,
		status: 'pending',
	};
	const listing = await Listing.create(payload);
	return res.status(201).json({ listing });
}

export async function updateListing(req, res) {
	const { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing) return res.status(404).json({ message: 'Not found' });
	if (String(listing.owner) !== req.user.id && req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Forbidden' });
	}
	Object.assign(listing, req.body);
	await listing.save();
	return res.json({ listing });
}

export async function getListing(req, res) {
	const { slug } = req.params;
	const listing = await Listing.findOne({ slug, status: 'approved' }).populate('owner', 'name');
	if (!listing) return res.status(404).json({ message: 'Not found' });
	listing.views += 1;
	await listing.save();
	return res.json({ listing });
}

export async function myListings(req, res) {
	const listings = await Listing.find({ owner: req.user.id }).sort({ createdAt: -1 });
	return res.json({ listings });
}

export async function adminApproveListing(req, res) {
	const { id } = req.params;
	const { status } = req.body; // 'approved' | 'rejected'
	const listing = await Listing.findById(id);
	if (!listing) return res.status(404).json({ message: 'Not found' });
	listing.status = status;
	await listing.save();
	return res.json({ listing });
}

export async function homepageSections(_req, res) {
	const now = dayjs().toDate();
    const [diamond, premium, free, featured, popular, newly] = await Promise.all([
        // Diamond (VIP)
        Listing.find({
            status: 'approved',
            'premium.level': 'vip',
            $or: [
                { 'premium.expiresAt': { $gt: now } },
                { 'premium.expiresAt': null },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(12),
        // Premium (featured or premium)
        Listing.find({
            status: 'approved',
            'premium.level': { $in: ['featured', 'premium'] },
            $or: [
                { 'premium.expiresAt': { $gt: now } },
                { 'premium.expiresAt': null },
            ],
        })
            .sort({ 'premium.level': -1, createdAt: -1 })
            .limit(12),
        // Free (no premium)
        Listing.find({ status: 'approved', 'premium.level': { $in: [null, 'none'] } })
            .sort({ createdAt: -1 })
            .limit(12),
        // Back-compat sections
        Listing.find({
            status: 'approved',
            'premium.level': { $in: ['featured', 'vip', 'premium'] },
            $or: [
                { 'premium.expiresAt': { $gt: now } },
                { 'premium.expiresAt': null },
            ],
        })
            .sort({ 'premium.level': -1, createdAt: -1 })
            .limit(12),
        Listing.find({ status: 'approved' }).sort({ views: -1 }).limit(12),
        Listing.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(12),
    ]);
    return res.json({ diamond, premium, free, featured, popular, newly });
}

export async function cityListings(req, res) {
    const { city } = req.params;
    const { category, gender, premium } = req.query;
    const where = { status: 'approved', 'contact.city': city };
    if (category) where.categories = category;
    if (gender) where['stats.gender'] = gender;
    if (premium === 'vip') where['premium.level'] = 'vip';
    if (premium === 'premium') where['premium.level'] = { $in: ['featured', 'premium'] };
    if (premium === 'free') where['premium.level'] = { $in: [null, 'none'] };
    const listings = await Listing.find(where).sort({ 'premium.level': -1, createdAt: -1 });
    return res.json({ listings });
}

export async function categoryListings(req, res) {
    const { category } = req.params;
    const { city, gender, premium } = req.query;
    const where = { status: 'approved', categories: category };
    if (city) where['contact.city'] = city;
    if (gender) where['stats.gender'] = gender;
    if (premium === 'vip') where['premium.level'] = 'vip';
    if (premium === 'premium') where['premium.level'] = { $in: ['featured', 'premium'] };
    if (premium === 'free') where['premium.level'] = { $in: [null, 'none'] };
    const listings = await Listing.find(where).sort({ 'premium.level': -1, createdAt: -1 });
    return res.json({ listings });
}

