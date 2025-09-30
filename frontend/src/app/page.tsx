"use client";

import { useEffect, useState } from "react";

type Listing = {
  _id: string;
  title: string;
  description: string;
};

export default function Home() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [popular, setPopular] = useState<Listing[]>([]);
  const [newest, setNewest] = useState<Listing[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/api/home`)
      .then((r) => r.json())
      .then((d) => {
        setFeatured(d.featured || []);
        setPopular(d.popular || []);
        setNewest(d.newest || []);
      })
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Directory Listings</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-2">Featured</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((l) => (
            <li key={l._id} className="border rounded p-3">
              <div className="font-medium">{l.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{l.description}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-2">Popular</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popular.map((l) => (
            <li key={l._id} className="border rounded p-3">
              <div className="font-medium">{l.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{l.description}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Newly Added</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {newest.map((l) => (
            <li key={l._id} className="border rounded p-3">
              <div className="font-medium">{l.title}</div>
              <div className="text-sm text-gray-600 line-clamp-2">{l.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
