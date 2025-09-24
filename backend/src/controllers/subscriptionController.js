import dayjs from 'dayjs';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';

export const getPlans = async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
  res.json({ plans });
};

export const subscribe = async (req, res) => {
  const { planId } = req.body;
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  const startDate = new Date();
  const endDate = dayjs(startDate).add(plan.durationDays, 'day').toDate();
  const subscription = await Subscription.create({ user: req.user._id, plan: plan._id, startDate, endDate });
  res.status(201).json({ subscription });
};

export const mySubscription = async (req, res) => {
  const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' }).populate('plan');
  res.json({ subscription });
};

import { User } from '../models/User.js';
import { sendEmail } from '../utils/email.js';

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
    // Notify user
    try {
        const user = await User.findById(req.user.id).select('email name');
        if (user?.email) {
            const remainingDays = Math.max(0, newEnd.diff(now, 'day'));
            const html = `<p>Hi ${user?.name || ''},</p><p>Your subscription is active until <strong>${newEnd.format('YYYY-MM-DD')}</strong> (${remainingDays} days).</p>`;
            await sendEmail({ to: user.email, subject: 'Subscription updated', html });
        }
    } catch {}
	return res.json({ subscription: sub, remainingDays: Math.max(0, newEnd.diff(now, 'day')) });
}

