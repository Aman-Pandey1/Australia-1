'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, setAuthToken } from '../../../lib/api';
import { getSession } from '../../../lib/auth';

export default function MyListingsPage() {
  const session = getSession();
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    if (session) setAuthToken(session.token);
    (async () => {
      try {
        const { data } = await api.get('/listings/me');
        setListings(data?.listings || []);
      } catch {}
    })();
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Listings</h1>
        <Link href="/account/listings/new" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Add Listing</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <div key={l._id} className="rounded-lg border p-3">
            <div className="mb-2 text-sm text-gray-500">{l.status}</div>
            <div className="font-medium">{l.title}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{l.description}</div>
            <div className="mt-2 text-sm">${l.price}</div>
            <div className="mt-3 flex gap-2">
              <Link href={`/account/listings/${l._id}`} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}