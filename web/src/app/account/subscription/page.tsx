'use client';

import { useEffect, useState } from 'react';
import { api, setAuthToken } from '../../../lib/api';
import { getSession } from '../../../lib/auth';
import { Button } from '../../../components/ui/button';

export default function SubscriptionPage() {
  const session = getSession();
  const [status, setStatus] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [remaining, setRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) setAuthToken(session.token);
    (async () => {
      try {
        const { data } = await api.get('/subscriptions/me');
        const sub = data?.subscription;
        if (sub) {
          setStatus(sub.status);
          setExpiresAt(sub.expiresAt);
        }
        setRemaining(data?.remainingDays || 0);
      } catch {}
      setLoading(false);
    })();
  }, [session]);

  async function recharge(months = 1) {
    setLoading(true);
    try {
      const { data } = await api.post('/subscriptions/recharge', { months });
      const sub = data?.subscription;
      if (sub) {
        setStatus(sub.status);
        setExpiresAt(sub.expiresAt);
      }
      setRemaining(data?.remainingDays || 0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Subscription</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm">Status: <strong>{status || 'none'}</strong></p>
          <p className="text-sm">Expires at: <strong>{expiresAt ? new Date(expiresAt).toLocaleDateString() : '-'}</strong></p>
          <p className="text-sm">Remaining days: <strong>{remaining}</strong></p>
          <div className="pt-2">
            <Button onClick={() => recharge(1)}>Recharge 1 month</Button>
          </div>
        </div>
      )}
    </div>
  );
}