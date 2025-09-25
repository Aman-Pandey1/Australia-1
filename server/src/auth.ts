import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const SECRET = process.env.JWT_SECRET || 'devsecret'

export type JwtPayload = { sub: string; role: 'USER' | 'ADMIN' }

export function signToken(payload: JwtPayload): string {
	return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, SECRET) as JwtPayload
	} catch {
		return null
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies?.token as string | undefined
	if (!token) return res.status(401).json({ message: 'Unauthorized' })
	const payload = verifyToken(token)
	if (!payload) return res.status(401).json({ message: 'Unauthorized' })
	;(req as any).auth = payload
	return next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
	const payload = (req as any).auth as JwtPayload | undefined
	if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })
	return next()
}