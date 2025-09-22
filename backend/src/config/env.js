import dotenv from 'dotenv';

dotenv.config();

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
};

export default env;

