import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend root regardless of process.cwd()
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const backendEnvPath = path.resolve(__dirname, '../../.env');
    dotenv.config({ path: backendEnvPath });
} catch {
    dotenv.config();
}

export const env = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: parseInt(process.env.PORT || '4000', 10),
	MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_app',
	JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
	CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
	SMTP_HOST: process.env.SMTP_HOST || '',
	SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
	SMTP_USER: process.env.SMTP_USER || '',
	SMTP_PASS: process.env.SMTP_PASS || '',
	SMTP_FROM: process.env.SMTP_FROM || 'noreply@example.com',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123456',
    ADMIN_NAME: process.env.ADMIN_NAME || 'Administrator',
};

export default env;

