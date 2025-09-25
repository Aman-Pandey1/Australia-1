import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export default async function SubscriptionPage() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) redirect("/login?callbackUrl=/subscription")
	const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { subscriptions: true, profile: true } })
	if (!user) redirect("/login?callbackUrl=/subscription")

	const active = user.subscriptions.find(s => s.expiresAt > new Date())
	return (
		<div className="max-w-2xl space-y-6">
			<h1 className="text-2xl font-semibold">Subscription</h1>
			{active ? (
				<div className="border rounded p-4">
					<p>Current plan: <b>{active.plan}</b></p>
					<p>Expires: {new Date(active.expiresAt).toLocaleString()}</p>
				</div>
			) : (
				<p className="opacity-80">No active subscription.</p>
			)}
			<form action="/api/subscription" method="post" className="grid sm:grid-cols-3 gap-3">
				<input type="hidden" name="action" value="buy" />
				<button name="plan" value="PREMIUM" className="border rounded px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10">Buy Premium (30 days)</button>
				<button name="plan" value="DIAMOND" className="border rounded px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10">Buy Diamond (30 days)</button>
				<button name="plan" value="FREE" className="border rounded px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10">Downgrade to Free</button>
			</form>
			<p className="text-sm opacity-70">Purchases are mocked for demo.</p>
		</div>
	)
}

