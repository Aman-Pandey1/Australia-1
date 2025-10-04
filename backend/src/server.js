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

 

