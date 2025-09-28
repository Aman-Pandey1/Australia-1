export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <a href="/" className="font-semibold">Escortify</a>
          <nav className="flex items-center gap-3">
            <a href="/login" className="text-sm hover:underline">Login</a>
            <a href="/register" className="text-sm hover:underline">Sign up</a>
            <a href="/account" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">My Account</a>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}