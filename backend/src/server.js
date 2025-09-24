import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

const start = async () => {
  await connectToDatabase();
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

