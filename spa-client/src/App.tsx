import { useEffect, useState } from 'react'

function App() {
	const [ready, setReady] = useState(false)
	useEffect(() => { setReady(true) }, [])
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b p-4 flex justify-between items-center">
				<div className="font-semibold">ProfileHub (SPA)</div>
				<nav className="flex gap-4 text-sm">
					<a href="/" className="hover:underline">Home</a>
					<a href="/login" className="hover:underline">Login</a>
					<a href="/signup" className="hover:underline">Signup</a>
				</nav>
			</header>
			<main className="container mx-auto p-4 grow">
				{ready ? <p>SPA shell ready. I will wire shadcn/ui components and API next.</p> : null}
			</main>
			<footer className="border-t p-4 text-sm opacity-80">
				© {new Date().getFullYear()} ProfileHub
			</footer>
		</div>
	)
}

export default App
