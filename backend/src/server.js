const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { connectToDatabase } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { authenticateOptional } = require('./middleware/auth');

// Routers
const authRouter = require('./routes/auth.routes');
const listingRouter = require('./routes/listing.routes');
const reviewRouter = require('./routes/review.routes');
const commentRouter = require('./routes/comment.routes');
const favoriteRouter = require('./routes/favorite.routes');
const reportRouter = require('./routes/report.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const adRouter = require('./routes/ad.routes');
const taskRouter = require('./routes/task.routes');
const contactRouter = require('./routes/contact.routes');
const homeRouter = require('./routes/home.routes');

// Cron jobs
require('./cron/subscription.cron');

async function bootstrap() {
  await connectToDatabase();
  const app = express();

  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(authenticateOptional);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/listings', listingRouter);
  app.use('/api/reviews', reviewRouter);
  app.use('/api/comments', commentRouter);
  app.use('/api/favorites', favoriteRouter);
  app.use('/api/reports', reportRouter);
  app.use('/api/subscriptions', subscriptionRouter);
  app.use('/api/ads', adRouter);
  app.use('/api/tasks', taskRouter);
  app.use('/api/contacts', contactRouter);
  app.use('/api/home', homeRouter);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import User from './models/User.js';
import { env } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRouter);

// Serve uploaded images
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch {}
app.use('/uploads', express.static(uploadsDir));

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

const start = async () => {
  await connectToDatabase();
  // Ensure an admin user exists so admin login always works in dev/test
  try {
    const email = env.adminEmail;
    const password = env.adminPassword;
    const name = env.adminName;
    let admin = await User.findOne({ email });
    if (!admin) {
      const passwordHash = await User.hashPassword(password);
      admin = await User.create({ email, passwordHash, name, role: 'admin' });
      // eslint-disable-next-line no-console
      console.log('[admin] Created admin user:', email);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[admin] Failed to ensure admin user exists:', err?.message || err);
  }
  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${env.port}`);
  });
  server.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[server:error]', err);
  });
};

start();

