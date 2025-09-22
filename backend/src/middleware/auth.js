import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticate(req, res, next) {
	const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).json({ message: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, env.JWT_SECRET);
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

