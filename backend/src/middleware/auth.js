import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticate(req, res, next) {
  const bearer = req.headers.authorization || '';
  const token = bearer.startsWith('Bearer ')
    ? bearer.slice(7)
    : req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.length) return next();
    if (roles.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

