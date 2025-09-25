"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient, Role, Plan } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

async function ensureAdmin() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) throw new Error("Unauthorized")
	const user = await prisma.user.findUnique({ where: { email: session.user.email } })
	if (!user || user.role !== "ADMIN") throw new Error("Forbidden")
}

export async function setUserRole(userId: string, role: Role) {
	await ensureAdmin()
	await prisma.user.update({ where: { id: userId }, data: { role } })
	revalidatePath("/admin")
}

export async function setProfileTier(userId: string, plan: Plan) {
	await ensureAdmin()
	await prisma.profile.update({ where: { userId }, data: { tier: plan } })
	revalidatePath("/admin")
}

export async function setAdvertised(userId: string, isAdvertised: boolean) {
	await ensureAdmin()
	await prisma.profile.update({ where: { userId }, data: { isAdvertised } })
	revalidatePath("/admin")
}

