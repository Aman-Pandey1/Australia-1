export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <section className="py-8">
        <h1 className="text-2xl font-semibold">Discover Escorts</h1>
        <p className="text-sm text-gray-500">VIP • Premium • Featured • New</p>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* TODO: Cards fetched from /api/listings/home/sections */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-lg bg-gray-100" />
        ))}
      </section>
    </main>
  );
}