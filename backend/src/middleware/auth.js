const jwt = require('jsonwebtoken');
const env = require('../config/env');

function parseTokenFromRequest(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

function authenticateOptional(req, _res, next) {
  const token = parseTokenFromRequest(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
  } catch (_err) {
    // ignore invalid token for optional auth
  }
  next();
}

function requireAuth(req, res, next) {
  const token = parseTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { authenticateOptional, requireAuth, requireRole };
 
