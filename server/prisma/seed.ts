import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
	const email = process.env.ADMIN_EMAIL || 'admin@example.com'
	const password = process.env.ADMIN_PASSWORD || 'admin123'
	const passwordHash = await bcrypt.hash(password, 10)
	await prisma.user.upsert({
		where: { email },
		update: { },
		create: {
			name: 'Admin',
			email,
			password: passwordHash,
			role: 'ADMIN',
			profile: { create: { displayName: 'Site Admin', bio: 'Administrator' } },
		},
	})
	console.log('Seeded admin user', email)
}

main().finally(async () => {
	await prisma.$disconnect()
})