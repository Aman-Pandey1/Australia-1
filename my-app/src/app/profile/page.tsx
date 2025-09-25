import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import ProfileForm from "./profile-form"

const prisma = new PrismaClient()

async function getOwnProfile(userId: string) {
	const profile = await prisma.profile.findUnique({ where: { userId } })
	return profile
}

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) redirect("/login?callbackUrl=/profile")
	const user = await prisma.user.findUnique({ where: { email: session.user.email } })
	if (!user) redirect("/login?callbackUrl=/profile")
	const profile = await getOwnProfile(user.id)
	return <ProfileForm profile={profile} />
}

