import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient, Role, Plan } from "@prisma/client"
import { redirect } from "next/navigation"
import { setUserRole, setProfileTier, setAdvertised } from "./actions"

const prisma = new PrismaClient()

export default async function AdminPage() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) redirect("/login?callbackUrl=/admin")
	const user = await prisma.user.findUnique({ where: { email: session.user.email } })
	if (!user || user.role !== "ADMIN") redirect("/")

	const [users, profiles] = await Promise.all([
		prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
		prisma.profile.findMany({ include: { user: true }, orderBy: { updatedAt: "desc" } }),
	])

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold">Admin Dashboard</h1>
			<section>
				<h2 className="text-lg font-semibold mb-2">Users</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm border">
						<thead className="bg-black/5 dark:bg-white/10">
							<tr>
								<th className="p-2 text-left">Email</th>
								<th className="p-2 text-left">Role</th>
								<th className="p-2 text-left">Created</th>
							</tr>
						</thead>
						<tbody>
							{users.map(u => (
								<tr key={u.id} className="border-t">
									<td className="p-2">{u.email}</td>
									<td className="p-2">
										<form action={async (formData) => {
											'use server'
											await setUserRole(u.id, formData.get('role') as Role)
										}}>
											<select name="role" defaultValue={u.role} className="border rounded px-2 py-1 bg-transparent">
												<option value="USER">USER</option>
												<option value="ADMIN">ADMIN</option>
											</select>
											<button className="ml-2 px-2 py-1 border rounded">Save</button>
										</form>
									</td>
									<td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
			<section>
				<h2 className="text-lg font-semibold mb-2">Profiles</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm border">
						<thead className="bg-black/5 dark:bg-white/10">
							<tr>
								<th className="p-2 text-left">User</th>
								<th className="p-2 text-left">Display</th>
								<th className="p-2 text-left">Plan</th>
								<th className="p-2 text-left">Advertised</th>
							</tr>
						</thead>
						<tbody>
							{profiles.map(p => (
								<tr key={p.id} className="border-t">
									<td className="p-2">{p.user.email}</td>
									<td className="p-2">{p.displayName || '—'}</td>
									<td className="p-2">
										<form action={async (formData) => {
											'use server'
											await setProfileTier(p.userId, formData.get('tier') as Plan)
										}}>
											<select name="tier" defaultValue={p.tier} className="border rounded px-2 py-1 bg-transparent">
												<option value="FREE">FREE</option>
												<option value="PREMIUM">PREMIUM</option>
												<option value="DIAMOND">DIAMOND</option>
											</select>
											<button className="ml-2 px-2 py-1 border rounded">Save</button>
										</form>
									</td>
									<td className="p-2">
										<form action={async (formData) => {
											'use server'
											await setAdvertised(p.userId, formData.get('adv') === 'on')
										}}>
											<label className="inline-flex items-center gap-2">
												<input name="adv" type="checkbox" defaultChecked={p.isAdvertised} />
												<button className="ml-2 px-2 py-1 border rounded">Save</button>
											</label>
										</form>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}

