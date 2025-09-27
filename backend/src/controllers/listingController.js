import { validationResult } from 'express-validator';
import dayjs from 'dayjs';
import { Listing } from '../models/Listing.js';
import { Subscription } from '../models/Subscription.js';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function createListing(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // Only agents and admins can create listings
  try {
    const actor = await User.findById(req.user.id).select('role accountType');
    const isAdmin = actor?.role === 'admin';
    const isAgent = actor?.accountType === 'agent';
    if (!isAdmin && !isAgent) {
      return res.status(403).json({ message: 'Only agents can create listings' });
    }
    // Enforce per-listing plan selection for agents
    if (isAgent && !isAdmin) {
      // Require plan selection per listing for agents
      const planType = String(req.body.planType || '').toLowerCase();
      if (!['vip', 'premium', 'featured'].includes(planType)) {
        return res.status(400).json({ message: 'Plan selection required (vip, premium, or featured)' });
      }
      const now = dayjs();
      const activeSub = await Subscription.findOne({ user: req.user.id, status: 'active', expiresAt: { $gt: now.toDate() } });
      if (!activeSub) {
        return res.status(402).json({ message: 'Active subscription required for selected plan' });
      }
    }
  } catch (_e) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Parse optional nested JSON strings coming from multipart/form-data
  let contact = req.body.contact;
  let stats = req.body.stats;
  try { if (typeof contact === 'string') contact = JSON.parse(contact); } catch { /* ignored */ }
  try { if (typeof stats === 'string') stats = JSON.parse(stats); } catch { /* ignored */ }

  // Coerce numeric fields
  const price = req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : undefined;
  if (stats && stats.age !== undefined && stats.age !== '') stats.age = Number(stats.age);

  // Images uploaded via multer
  const uploaded = Array.isArray(req.files) ? req.files : [];
  const photos = uploaded.map((f) => `${env.publicUrl.replace(/\/$/, '')}/uploads/${f.filename}`);

  const ownerId = (req.user.role === 'admin' && req.body.owner) ? req.body.owner : req.user.id;

  const payload = {
    title: req.body.title,
    description: req.body.description || '',
    owner: ownerId,
    contact,
    stats,
    photos,
    price,
    status: env.autoApproveListings ? 'approved' : 'pending',
  };
  // Apply optional premium plan at creation time when agent selected and subscription allows
  const planType = String(req.body.planType || '').toLowerCase();
  if (['vip','premium','featured'].includes(planType)) {
    payload.premium = payload.premium || {};
    payload.premium.level = planType;
    if (planType === 'vip') payload.premium.showOnHomepage = true;
    const citiesStr = req.body.planCities || '';
    if (citiesStr) {
      const cityArr = String(citiesStr).split(',').map((s)=>s.trim()).filter(Boolean);
      if (cityArr.length) payload.premium.cities = cityArr;
    }
    const now = dayjs();
    payload.premium.startsAt = now.toDate();
    payload.premium.expiresAt = now.add(30, 'day').toDate();
  }
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
  // Allow updating details; if files uploaded, append to photos
  const payload = { ...req.body };
  let contact = payload.contact;
  let stats = payload.stats;
  try { if (typeof contact === 'string') contact = JSON.parse(contact); } catch {}
  try { if (typeof stats === 'string') stats = JSON.parse(stats); } catch {}
  if (contact) listing.contact = contact;
  if (stats) listing.stats = stats;
  if (payload.title) listing.title = payload.title;
  if (payload.description !== undefined) listing.description = payload.description;
  if (payload.price !== undefined && payload.price !== '') listing.price = Number(payload.price);
  const uploaded = Array.isArray(req.files) ? req.files : [];
  if (uploaded.length) {
    const photos = uploaded.map((f) => `${env.publicUrl.replace(/\/$/, '')}/uploads/${f.filename}`);
    listing.photos = [...(listing.photos || []), ...photos];
  }
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
    Listing.find({ status: 'approved', 'premium.level': 'vip', $or: [ { 'premium.expiresAt': { $gt: now } }, { 'premium.expiresAt': null } ] })
      .sort({ createdAt: -1 })
      .limit(12),
    Listing.find({ status: 'approved', 'premium.level': { $in: ['featured', 'premium'] }, $or: [ { 'premium.expiresAt': { $gt: now } }, { 'premium.expiresAt': null } ] })
      .sort({ 'premium.level': -1, createdAt: -1 })
      .limit(12),
    Listing.find({ status: 'approved', $or: [ { 'premium.level': { $in: [null, 'none'] } }, { premium: { $exists: false } } ] })
      .sort({ createdAt: -1 })
      .limit(12),
    Listing.find({ status: 'approved', 'premium.level': { $in: ['featured', 'vip', 'premium'] }, $or: [ { 'premium.expiresAt': { $gt: now } }, { 'premium.expiresAt': null } ] })
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

// Promote listing to VIP (homepage) if user has an active subscription
export async function promoteListing(req, res) {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Not found' });
  if (String(listing.owner) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  // Check subscription
  const now = dayjs();
  const activeSub = await Subscription.findOne({ user: req.user.id, status: 'active', expiresAt: { $gt: now.toDate() } });
  if (!activeSub && req.user.role !== 'admin') {
    return res.status(402).json({ message: 'Active subscription required' });
  }
  listing.premium = listing.premium || {};
  listing.premium.level = 'vip';
  listing.premium.startsAt = now.toDate();
  listing.premium.expiresAt = now.add(30, 'day').toDate();
  listing.premium.showOnHomepage = true;
  await listing.save();
  return res.json({ listing });
}

