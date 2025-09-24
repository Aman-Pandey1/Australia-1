import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import apiRouter from './routes/index.js';
import { Subscription } from './models/Subscription.js';
import dayjs from 'dayjs';
import { User } from './models/User.js';
import { sendEmail } from './utils/email.js';
import { Page } from './models/Page.js';
import { Post } from './models/Post.js';

const app = express();

// Security & misc middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
	cors({
		origin: env.CLIENT_URL,
		credentials: true,
	})
);

// Logger
if (env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// Redirect root to client home page so main route shows homepage
app.get('/', (_req, res) => {
    try {
        return res.redirect(302, env.CLIENT_URL);
    } catch {
        return res.status(200).send('<!doctype html><html><head><meta http-equiv="refresh" content="0; url=' + (env.CLIENT_URL || '/') + '" /></head><body>Redirecting...</body></html>');
    }
});

// API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

// Start server
const start = async () => {
	// eslint-disable-next-line no-console
	console.log('[startup] NODE_ENV=', env.NODE_ENV);
	// eslint-disable-next-line no-console
	console.log('[startup] Connecting to MongoDB...');
	await connectDatabase();
    // Ensure a default admin exists for development/demo convenience
    try {
        const adminEmail = env.ADMIN_EMAIL;
        const adminPassword = env.ADMIN_PASSWORD;
        const adminName = env.ADMIN_NAME;
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const passwordHash = await User.hashPassword(adminPassword);
            admin = await User.create({ email: adminEmail, passwordHash, name: adminName, role: 'admin' });
            // eslint-disable-next-line no-console
            console.log(`[startup] Default admin created: ${adminEmail}`);
        } else if (admin.role !== 'admin') {
            admin.role = 'admin';
            await admin.save();
            // eslint-disable-next-line no-console
            console.log(`[startup] Ensured admin role for: ${adminEmail}`);
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[startup] Failed to ensure default admin:', e?.message || e);
    }
    // Seed default About page and a sample blog if missing
    try {
        const about = await Page.findOne({ slug: 'about' });
        if (!about) {
            await Page.create({
                title: 'About Escortify',
                slug: 'about',
                description: 'Escortify® — Better Technology, Smarter Escorts',
                content: '<p>We are an Australian directory focused on quality, safety, and a delightful user experience. Our team curates listings and features to help audiences discover trustworthy profiles.</p><p>We strive to ensure privacy-first experiences and modern tooling for advertisers.</p>'
            });
            // eslint-disable-next-line no-console
            console.log('[startup] Seeded default About page');
        }
        const sample = await Post.findOne({ slug: 'welcome' });
        if (!sample) {
            await Post.create({
                title: 'Welcome to Escortify',
                slug: 'welcome',
                description: 'A quick look at features and how to get started',
                content: '<p>This is a sample post. Use the Admin panel to add more content, update pricing or publish news.</p>',
                status: 'published'
            });
            // eslint-disable-next-line no-console
            console.log('[startup] Seeded sample blog post');
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[startup] Failed to seed default content:', e?.message || e);
    }
	// eslint-disable-next-line no-console
	console.log('[startup] Starting HTTP server on port', env.PORT);
	const server = app.listen(env.PORT, () => {
		// eslint-disable-next-line no-console
		console.log(`Server running on http://localhost:${env.PORT}`);
	});
	server.on('error', (err) => {
		// eslint-disable-next-line no-console
		console.error('[server:error]', err);
	});

    // Simple daily reminder job (every hour for demo) for subs expiring within 3 days
    setInterval(async () => {
        try {
            const now = dayjs();
            const soon = now.add(3, 'day').toDate();
            const subs = await Subscription.find({ status: 'active', expiresAt: { $lte: soon, $gte: now.toDate() } }).limit(100);
            for (const sub of subs) {
                const user = await User.findById(sub.user).select('email name');
                if (user?.email) {
                    const daysLeft = Math.max(0, dayjs(sub.expiresAt).diff(now, 'day'));
                    const html = `<p>Hi ${user?.name || ''},</p><p>Your subscription expires in <strong>${daysLeft} days</strong>. Consider recharging to stay active.</p>`;
                    await sendEmail({ to: user.email, subject: 'Subscription expiring soon', html });
                }
            }
        } catch {}
    }, 60 * 60 * 1000);
};

start();

