import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');

// Prefer backend/.env if present; otherwise fall back to project root .env
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_app',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  publicUrl: process.env.PUBLIC_URL || process.env.SERVER_PUBLIC_URL || 'http://localhost:4000',
  autoApproveListings: String(process.env.AUTO_APPROVE_LISTINGS || 'true') === 'true',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailFrom: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@example.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123456',
  adminName: process.env.ADMIN_NAME || 'Administrator',
};

export default env;

