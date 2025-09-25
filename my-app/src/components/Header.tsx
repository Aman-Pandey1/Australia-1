"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

export default function Header() {
	const { data: session, status } = useSession()
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		setIsOpen(false)
	}, [pathname])

	const isAdmin = session?.user?.role === "ADMIN"

	return (
		<header className="w-full border-b border-black/10 dark:border-white/10 bg-background sticky top-0 z-40">
			<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
				<Link href="/" className="font-semibold text-lg">ProfileHub</Link>

				<nav className="hidden md:flex items-center gap-4">
					<Link href="/" className="hover:underline">Home</Link>
					<a href="mailto:admin@example.com" className="opacity-80 hover:underline">admin@example.com</a>
					{status === "authenticated" ? (
						<>
							{isAdmin && <Link href="/admin" className="hover:underline">Dashboard</Link>}
							<Link href="/profile" className="hover:underline">My Profile</Link>
							<Link href="/subscription" className="hover:underline">Subscription</Link>
							<button onClick={() => signOut()} className="px-3 py-1 rounded border hover:bg-black/5 dark:hover:bg-white/10">Sign out</button>
						</>
					) : (
						<>
							<Link href="/login" className="hover:underline">Login</Link>
							<Link href="/signup" className="hover:underline">Signup</Link>
						</>
					)}
				</nav>

				<button className="md:hidden px-3 py-2 border rounded" onClick={() => setIsOpen(v => !v)} aria-label="Toggle menu">☰</button>
			</div>
			{isOpen && (
				<div className="md:hidden border-t border-black/10 dark:border-white/10">
					<div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-2">
						<Link href="/" className="py-2">Home</Link>
						{status === "authenticated" ? (
							<>
								{isAdmin && <Link href="/admin" className="py-2">Dashboard</Link>}
								<Link href="/profile" className="py-2">My Profile</Link>
								<Link href="/subscription" className="py-2">Subscription</Link>
								<button onClick={() => signOut()} className="py-2 text-left">Sign out</button>
							</>
						) : (
							<>
								<a href="mailto:admin@example.com" className="py-2 opacity-80">admin@example.com</a>
								<Link href="/login" className="py-2">Login</Link>
								<Link href="/signup" className="py-2">Signup</Link>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	)
}