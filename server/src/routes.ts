import { Router } from 'express'
import { prisma } from './db'
import { signToken, requireAuth, requireAdmin } from './auth'
import bcrypt from 'bcrypt'

export const router = Router()

// Auth
router.post('/auth/signup', async (req, res) => {
	const { name, email, password } = req.body as { name?: string; email: string; password: string }
	if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
	const existing = await prisma.user.findUnique({ where: { email } })
	if (existing) return res.status(409).json({ message: 'Email already in use' })
	const passwordHash = await bcrypt.hash(password, 10)
	await prisma.user.create({ data: { name: name || null, email, password: passwordHash, profile: { create: {} } } })
	return res.status(201).json({ ok: true })
})

// Compatibility: allow /auth/register to behave like signup
router.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body as { name?: string; email: string; password: string }
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name: name || null, email, password: passwordHash, role: 'USER', profile: { create: {} } } })
    const token = signToken({ sub: user.id, role: user.role })
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token })
})

router.post('/auth/login', async (req, res) => {
	const { email, password } = req.body as { email: string; password: string }
	const user = await prisma.user.findUnique({ where: { email } })
	if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' })
	const ok = await bcrypt.compare(password, user.password)
	if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
	const token = signToken({ sub: user.id, role: user.role })
	res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
	return res.json({ ok: true, role: user.role })
})

router.post('/auth/logout', (req, res) => {
	res.clearCookie('token')
	return res.json({ ok: true })
})

router.get('/auth/me', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	const user = await prisma.user.findUnique({ where: { id: sub }, include: { profile: true, subscriptions: true } })
	return res.json({ user })
})

// Profiles public grouped
router.get('/profiles/public', async (_req, res) => {
	const [diamond, premium, free] = await Promise.all([
		prisma.profile.findMany({ where: { tier: 'DIAMOND' }, orderBy: { updatedAt: 'desc' }, take: 12 }),
		prisma.profile.findMany({ where: { tier: 'PREMIUM' }, orderBy: { updatedAt: 'desc' }, take: 12 }),
		prisma.profile.findMany({ where: { tier: 'FREE', isAdvertised: true }, orderBy: { updatedAt: 'desc' }, take: 24 }),
	])
	return res.json({ diamond, premium, free })
})

// Own profile get/update
router.get('/profile', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	const profile = await prisma.profile.findUnique({ where: { userId: sub } })
	return res.json({ profile })
})

router.post('/profile', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	const { displayName, bio, avatarUrl, tier, isAdvertised } = req.body as any
	const plan = ['FREE', 'PREMIUM', 'DIAMOND'].includes(tier) ? tier : 'FREE'
	const profile = await prisma.profile.upsert({
		where: { userId: sub },
		update: { displayName, bio, avatarUrl, tier: plan as any, isAdvertised: !!isAdvertised },
		create: { userId: sub, displayName, bio, avatarUrl, tier: plan as any, isAdvertised: !!isAdvertised },
	})
	return res.json({ ok: true, profile })
})

// Subscription
router.get('/subscription', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	const subs = await prisma.subscription.findMany({ where: { userId: sub } })
	const active = subs.find(s => s.expiresAt > new Date()) || null
	return res.json({ active })
})

router.post('/subscription/buy', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	const { plan } = req.body as { plan: 'PREMIUM' | 'DIAMOND' }
	const now = new Date()
	const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
	await prisma.subscription.create({ data: { userId: sub, plan, expiresAt: expires } })
	await prisma.profile.update({ where: { userId: sub }, data: { tier: plan } })
	return res.json({ ok: true })
})

router.post('/subscription/downgrade', requireAuth, async (req, res) => {
	const { sub } = (req as any).auth as { sub: string }
	await prisma.profile.update({ where: { userId: sub }, data: { tier: 'FREE' } })
	return res.json({ ok: true })
})

// Admin
router.get('/admin/users', requireAuth, requireAdmin, async (_req, res) => {
	const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
	return res.json({ users })
})

router.get('/admin/profiles', requireAuth, requireAdmin, async (_req, res) => {
	const profiles = await prisma.profile.findMany({ include: { user: true }, orderBy: { updatedAt: 'desc' } })
	return res.json({ profiles })
})

router.post('/admin/user/role', requireAuth, requireAdmin, async (req, res) => {
	const { userId, role } = req.body as { userId: string; role: 'USER' | 'ADMIN' }
	await prisma.user.update({ where: { id: userId }, data: { role } })
	return res.json({ ok: true })
})

router.post('/admin/profile/tier', requireAuth, requireAdmin, async (req, res) => {
	const { userId, tier } = req.body as { userId: string; tier: 'FREE' | 'PREMIUM' | 'DIAMOND' }
	await prisma.profile.update({ where: { userId }, data: { tier } })
	return res.json({ ok: true })
})

router.post('/admin/profile/advertise', requireAuth, requireAdmin, async (req, res) => {
	const { userId, isAdvertised } = req.body as { userId: string; isAdvertised: boolean }
	await prisma.profile.update({ where: { userId }, data: { isAdvertised } })
	return res.json({ ok: true })
})