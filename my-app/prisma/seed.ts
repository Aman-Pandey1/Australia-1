import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	const email = process.env.ADMIN_EMAIL || 'admin@example.com'
	const password = process.env.ADMIN_PASSWORD || 'admin123'
	const passwordHash = await bcrypt.hash(password, 10)

	const admin = await prisma.user.upsert({
		where: { email },
		update: { role: Role.ADMIN },
		create: {
			name: 'Admin',
			email,
			password: passwordHash,
			role: Role.ADMIN,
			profile: {
				create: {
					displayName: 'Site Admin',
					bio: 'Administrator account',
				},
			},
		},
	})

	console.log('Seeded admin user:', admin.email)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})