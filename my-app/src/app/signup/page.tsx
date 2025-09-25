"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		const res = await fetch("/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		})
		setLoading(false)
		if (!res.ok) {
			const data = await res.json().catch(() => ({}))
			setError(data?.message || "Failed to create account")
			return
		}
		router.push("/login")
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Signup</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block text-sm mb-1">Name</label>
					<input value={name} onChange={e => setName(e.target.value)} type="text" required className="w-full border rounded px-3 py-2 bg-transparent" />
				</div>
				<div>
					<label className="block text-sm mb-1">Email</label>
					<input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2 bg-transparent" />
				</div>
				<div>
					<label className="block text-sm mb-1">Password</label>
					<input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6} className="w-full border rounded px-3 py-2 bg-transparent" />
				</div>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full py-2 rounded bg-foreground text-background disabled:opacity-60">{loading ? 'Creating...' : 'Create account'}</button>
			</form>
		</div>
	)
}

