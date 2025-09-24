import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', true);
    let mongoUri = env.mongoUri || env.MONGODB_URI;
    if (mongoUri === 'memory' || String(process.env.USE_MEMORY_DB || '').toLowerCase() === 'true') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      mongoUri = mem.getUri();
    }
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error?.message || error);
  }
}

export default connectToDatabase;

