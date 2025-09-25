"use client"

import { Plan, Profile } from "@prisma/client"
import { useState, FormEvent } from "react"

type Props = { profile: Profile | null }

export default function ProfileForm({ profile }: Props) {
	const [displayName, setDisplayName] = useState(profile?.displayName ?? "")
	const [bio, setBio] = useState(profile?.bio ?? "")
	const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "")
	const [tier, setTier] = useState<Plan>(profile?.tier ?? "FREE")
	const [isAdvertised, setIsAdvertised] = useState<boolean>(profile?.isAdvertised ?? false)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setSaving(true)
		setMessage(null)
		const res = await fetch("/api/profile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ displayName, bio, avatarUrl, tier, isAdvertised }),
		})
		setSaving(false)
		if (!res.ok) {
			setMessage("Failed to save")
			return
		}
		setMessage("Saved")
	}

	return (
		<form onSubmit={onSubmit} className="max-w-2xl space-y-4">
			<h1 className="text-2xl font-semibold">My Profile</h1>
			<div>
				<label className="block text-sm mb-1">Display Name</label>
				<input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent" />
			</div>
			<div>
				<label className="block text-sm mb-1">Bio</label>
				<textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent" rows={4} />
			</div>
			<div>
				<label className="block text-sm mb-1">Avatar URL</label>
				<input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent" />
			</div>
			<div className="grid sm:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm mb-1">Plan</label>
					<select value={tier} onChange={e => setTier(e.target.value as Plan)} className="w-full border rounded px-3 py-2 bg-transparent">
						<option value="FREE">Free</option>
						<option value="PREMIUM">Premium</option>
						<option value="DIAMOND">Diamond</option>
					</select>
				</div>
				<div className="flex items-end">
					<label className="inline-flex items-center gap-2"><input type="checkbox" checked={isAdvertised} onChange={e => setIsAdvertised(e.target.checked)} /> Advertise profile</label>
				</div>
			</div>
			{message && <p className="text-sm opacity-80">{message}</p>}
			<button disabled={saving} className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
		</form>
	)
}

