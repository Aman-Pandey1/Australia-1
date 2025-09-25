export default function Footer() {
	return (
		<footer className="border-t border-black/10 dark:border-white/10 mt-16">
			<div className="mx-auto max-w-6xl px-4 py-6 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p className="opacity-70">© {new Date().getFullYear()} ProfileHub</p>
				<div className="flex gap-4 opacity-80">
					<a href="mailto:admin@example.com" className="hover:underline">admin@example.com</a>
					<a href="/privacy" className="hover:underline">Privacy</a>
					<a href="/terms" className="hover:underline">Terms</a>
				</div>
			</div>
		</footer>
	)
}

