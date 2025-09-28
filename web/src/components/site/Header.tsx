"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSession } from '../../lib/auth';

export default function Header() {
  const [session, setSession] = useState(getSession());
  useEffect(() => {
    setSession(getSession());
  }, []);
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">Escortify</Link>
        <nav className="flex items-center gap-3">
          <Link href="/city/sydney" className="text-sm hover:underline">Sydney</Link>
          <Link href="/city/melbourne" className="text-sm hover:underline">Melbourne</Link>
          {session ? (
            <Link href="/account" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">My Account</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline">Login</Link>
              <Link href="/register" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}