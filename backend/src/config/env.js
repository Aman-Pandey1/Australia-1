const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/escort_directory',
  jwtSecret: process.env.JWT_SECRET || 'dev_super_secret_change_me',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT || 1025),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'noreply@example.com'
  }
};

module.exports = env;


