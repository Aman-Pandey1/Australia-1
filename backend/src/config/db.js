import mongoose from 'mongoose';
import { env } from './env.js';
let memoryServer = null;

export async function connectDatabase() {
	try {
		mongoose.set('strictQuery', true);
		let mongoUri = env.MONGODB_URI;
		if (mongoUri === 'memory' || String(process.env.USE_MEMORY_DB).toLowerCase() === 'true') {
			// Lazy import to avoid dependency if not used
			const { MongoMemoryServer } = await import('mongodb-memory-server');
			memoryServer = await MongoMemoryServer.create();
			mongoUri = memoryServer.getUri();
		}
		await mongoose.connect(mongoUri, {
			bufferCommands: false,
			serverSelectionTimeoutMS: 2000,
		});
		// eslint-disable-next-line no-console
		console.log(`MongoDB connected: ${mongoose.connection.name}`);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('MongoDB connection error (continuing without DB):', error?.message || error);
	}
}

