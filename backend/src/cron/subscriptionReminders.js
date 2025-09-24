import cron from 'node-cron';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import Subscription from '../models/Subscription.js';
import { env } from '../config/env.js';
import User from '../models/User.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';

function createTransport() {
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user
      ? {
          user: env.smtp.user,
          pass: env.smtp.pass,
        }
      : undefined,
  });
  return transporter;
}

export function scheduleSubscriptionReminders() {
  // Run every day at 09:00
  cron.schedule('0 9 * * *', async () => {
    const targetDate = dayjs().add(3, 'day').startOf('day');
    const endStart = targetDate.toDate();
    const endEnd = targetDate.endOf('day').toDate();
    const expiring = await Subscription.find({
      endDate: { $gte: endStart, $lte: endEnd },
      status: 'active',
    }).populate('user').populate('plan');

    if (!expiring.length) return;

    const transporter = createTransport();
    for (const sub of expiring) {
      const user = sub.user instanceof User ? sub.user : await User.findById(sub.user);
      const plan = sub.plan instanceof SubscriptionPlan ? sub.plan : await SubscriptionPlan.findById(sub.plan);
      if (!user?.email) continue;
      await transporter.sendMail({
        from: env.emailFrom,
        to: user.email,
        subject: 'Your subscription is expiring soon',
        html: `<p>Hi ${user.name},</p><p>Your <b>${plan?.name || 'subscription'}</b> will expire on <b>${dayjs(sub.endDate).format('YYYY-MM-DD')}</b>. Please renew to continue enjoying premium features.</p>`,
      });
    }
  });
}

export default scheduleSubscriptionReminders;

