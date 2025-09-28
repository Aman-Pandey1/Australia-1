'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, setSession } from '../../lib/auth';
import { api, setAuthToken } from '../../lib/api';

export default function AccountPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(true);
  const [user, setUser] = useState(getSession()?.user || null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    setAuthToken(session.token);
    setUser(session.user);
  }, [router]);

  const items = useMemo(() => {
    const base = [
      { href: '/account/profile', label: 'My Profile' },
      { href: '/account/subscription', label: 'Subscription' },
    ];
    const agent = user?.accountType === 'agent' ? [{ href: '/account/listings', label: 'My Listings' }, { href: '/account/listings/new', label: 'Add Listing' }] : [];
    const admin = user?.role === 'admin' ? [{ href: '/admin', label: 'Admin Panel' }] : [];
    return [...base, ...agent, ...admin];
  }, [user]);

  async function logout() {
    try { await api.post('/auth/logout'); } catch {}
    setSession(null);
    setAuthToken(undefined);
    router.replace('/login');
  }

  return (
    <div className="container mx-auto grid grid-cols-12 gap-6 px-4 py-6">
      <aside className={`col-span-12 md:col-span-3 ${menuOpen ? '' : 'hidden md:block'}`}>
        <div className="rounded-lg border p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500">{user?.accountType}{user?.role === 'admin' ? ' · admin' : ''}</p>
          </div>
          <nav className="space-y-2">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="block rounded-md px-3 py-2 hover:bg-gray-100">
                {it.label}
              </Link>
            ))}
            <button onClick={logout} className="mt-2 w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-gray-50">Logout</button>
          </nav>
        </div>
      </aside>
      <main className="col-span-12 md:col-span-9">
        <div className="rounded-lg border p-4">
          <h1 className="text-xl font-semibold">Account</h1>
          <p className="text-sm text-gray-500">Choose an item from the sidebar.</p>
        </div>
      </main>
    </div>
  );
}