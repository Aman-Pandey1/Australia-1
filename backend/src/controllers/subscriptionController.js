import dayjs from 'dayjs';
import { Subscription } from '../models/Subscription.js';

export async function getMySubscription(req, res) {
	const sub = await Subscription.findOne({ user: req.user.id, status: 'active' }).sort({ createdAt: -1 });
	if (!sub) return res.json({ subscription: null, remainingDays: 0 });
	const remainingDays = Math.max(0, dayjs(sub.expiresAt).diff(dayjs(), 'day'));
	return res.json({ subscription: sub, remainingDays });
}

export async function rechargeSubscription(req, res) {
	const months = Number(req.body.months || 1);
	let sub = await Subscription.findOne({ user: req.user.id, status: 'active' }).sort({ createdAt: -1 });
	const now = dayjs();
	const base = sub && dayjs(sub.expiresAt).isAfter(now) ? dayjs(sub.expiresAt) : now;
	const newEnd = base.add(months, 'month');
	if (!sub) {
		sub = await Subscription.create({ user: req.user.id, plan: 'monthly', startedAt: now.toDate(), expiresAt: newEnd.toDate(), status: 'active' });
	} else {
		sub.expiresAt = newEnd.toDate();
		await sub.save();
	}
	return res.json({ subscription: sub, remainingDays: Math.max(0, newEnd.diff(now, 'day')) });
}

