
"use client"

import { FormEvent, Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"

function LoginInner() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const search = useSearchParams()
	const router = useRouter()

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		const callbackUrl = search.get("callbackUrl") || "/"
		const res = await signIn("credentials", { email, password, redirect: false })
		setLoading(false)
		if (res?.error) {
			setError("Invalid email or password")
			return
		}
		router.push(callbackUrl)
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block text-sm mb-1">Email</label>
					<input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2 bg-transparent" />
				</div>
				<div>
					<label className="block text-sm mb-1">Password</label>
					<input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border rounded px-3 py-2 bg-transparent" />
				</div>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full py-2 rounded bg-foreground text-background disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
			</form>
			<p className="text-sm mt-4 opacity-80">Admin: admin@example.com / admin123</p>
		</div>
	)
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginInner />
		</Suspense>
	)
}