'use client';

import { useEffect } from 'react';
import { getSession } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    const s = getSession();
    if (!s || s.user.role !== 'admin') router.replace('/login');
  }, [router]);
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <p className="text-sm text-gray-600">Coming soon: users, listings, subscriptions management.</p>
    </div>
  );
}