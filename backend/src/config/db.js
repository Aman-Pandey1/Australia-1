import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(env.MONGODB_URI, {
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

