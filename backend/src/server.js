import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import apiRouter from './routes/index.js';

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
};

start();

