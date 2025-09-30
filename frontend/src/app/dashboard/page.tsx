"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [me, setMe] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [plan, setPlan] = useState<'1m' | '3m' | '6m' | '12m'>('1m');
  const [msg, setMsg] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!token) return;
    fetch(`${api}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then((r) => r.json())
      .then((d) => setMe(d.user || null))
      .catch(() => {});
    fetch(`${api}/api/subscriptions/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then((r) => r.json())
      .then(setSub)
      .catch(() => {});
  }, [api]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {!me && <div className="text-sm text-gray-600">Login to view your account.</div>}
      {me && (
        <div className="space-y-2">
          <div><span className="font-medium">Name:</span> {me.name}</div>
          <div><span className="font-medium">Email:</span> {me.email}</div>
          <div><span className="font-medium">Role:</span> {me.role}</div>
          <div><span className="font-medium">Remaining days:</span> {sub?.remainingDays ?? 0}</div>
          <div className="mt-4 p-3 border rounded">
            <div className="font-medium mb-2">Buy Subscription</div>
            <select className="border rounded px-2 py-1" value={plan} onChange={(e) => setPlan(e.target.value as any)}>
              <option value="1m">1 month</option>
              <option value="3m">3 months</option>
              <option value="6m">6 months</option>
              <option value="12m">12 months</option>
            </select>
            <button
              className="ml-2 bg-black text-white rounded px-3 py-1"
              onClick={async () => {
                setMsg('');
                const token = localStorage.getItem('token') || '';
                const res = await fetch(`${api}/api/subscriptions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ plan }) });
                setMsg(res.ok ? 'Subscription purchased' : 'Failed');
              }}
            >
              Purchase
            </button>
            {msg && <div className="text-sm mt-2">{msg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

