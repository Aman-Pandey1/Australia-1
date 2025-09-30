const cron = require('node-cron');
const dayjs = require('dayjs');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendMail } = require('../services/mailer');

async function expireSubscriptions() {
  const now = new Date();
  await Subscription.updateMany({ active: true, expiresAt: { $lte: now } }, { active: false });
}

async function notifySubscribersExpiringSoon() {
  const inThreeDays = dayjs().add(3, 'day').toDate();
  const inTwoDays = dayjs().add(2, 'day').toDate();
  const expiring = await Subscription.find({ active: true, emailNotified: false, expiresAt: { $lte: inThreeDays, $gt: inTwoDays } });
  for (const sub of expiring) {
    const user = await User.findById(sub.user);
    if (user?.email) {
      try {
        await sendMail(user.email, 'Your subscription is expiring soon', `Hi ${user.name}, your subscription expires on ${dayjs(sub.expiresAt).format('YYYY-MM-DD')}.`);
        sub.emailNotified = true;
        await sub.save();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[cron] Failed to send expiry email', err);
      }
    }
  }
}

// Run every night at 02:00
cron.schedule('0 2 * * *', async () => {
  try {
    await expireSubscriptions();
    await notifySubscribersExpiringSoon();
    // eslint-disable-next-line no-console
    console.log(`[cron] Subscriptions expiration checked at ${dayjs().toISOString()}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[cron] Subscription job failed', err);
  }
});

module.exports = { expireSubscriptions, notifySubscribersExpiringSoon };

