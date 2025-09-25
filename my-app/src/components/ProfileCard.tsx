import Image from "next/image"

type Props = {
	displayName?: string | null
	bio?: string | null
	avatarUrl?: string | null
	plan: "FREE" | "PREMIUM" | "DIAMOND"
}

export default function ProfileCard({ displayName, bio, avatarUrl, plan }: Props) {
	return (
		<div className="border rounded-lg p-4 flex gap-4">
			<div className="shrink-0">
				{avatarUrl ? (
					<Image src={avatarUrl} alt={displayName || "Avatar"} width={64} height={64} className="rounded-full object-cover" />
				) : (
					<div className="w-16 h-16 rounded-full bg-black/10 dark:bg-white/10 grid place-items-center text-sm">{displayName?.[0] ?? '?'}</div>
				)}
			</div>
			<div className="min-w-0">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold truncate">{displayName || 'Unnamed'}</h3>
					<span className={`text-xs px-2 py-0.5 rounded-full border ${plan === 'DIAMOND' ? 'bg-cyan-100/40 dark:bg-cyan-900/30 border-cyan-400' : plan === 'PREMIUM' ? 'bg-amber-100/40 dark:bg-amber-900/30 border-amber-400' : 'bg-gray-100/40 dark:bg-gray-800/50 border-gray-400'}`}>{plan}</span>
				</div>
				<p className="text-sm opacity-80 line-clamp-2">{bio || 'No bio provided.'}</p>
			</div>
		</div>
	)
}

