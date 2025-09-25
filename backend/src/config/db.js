import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', true);
    const primaryUri = env.mongoUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_app';
    const localUri = 'mongodb://127.0.0.1:27017/mern_app';

    async function tryConnect(uri, label) {
      // eslint-disable-next-line no-console
      console.log(`[db] Trying ${label} -> ${uri}`);
      await mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      });
      // eslint-disable-next-line no-console
      console.log(`[db] Connected via ${label}: ${mongoose.connection.name}`);
    }

    const useMemory = String(process.env.USE_MEMORY_DB || '').toLowerCase() === 'true' || primaryUri === 'memory';
    if (useMemory) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      const uri = mem.getUri();
      await tryConnect(uri, 'in-memory');
      return;
    }

    try {
      await tryConnect(primaryUri, 'primary');
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[db] Primary connection failed:', err?.message || err);
    }

    try {
      await tryConnect(localUri, 'localhost');
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[db] Localhost connection failed:', err?.message || err);
    }

    // Fall back to in-memory if both fail
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      const uri = mem.getUri();
      await tryConnect(uri, 'in-memory');
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[db] In-memory connection failed:', err?.message || err);
      throw err;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error?.message || error);
  }
}

export default connectToDatabase;

