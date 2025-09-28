'use client';

import { useEffect, useState } from 'react';
import { api, setAuthToken } from '../../../lib/api';
import { getSession } from '../../../lib/auth';
import { Button } from '../../../components/ui/button';

export default function ProfilePage() {
  const session = getSession();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) setAuthToken(session.token);
    // Optionally fetch current profile details
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        const u = data?.user;
        if (u) setName(u.name || '');
      } catch {}
    })();
  }, [session]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append('name', name);
      if (avatarUrl) form.append('avatarUrl', avatarUrl);
      // For extended fields, we will send a JSON payload via a separate endpoint once backend supports it
      await api.patch('/auth/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Saved');
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Edit Profile</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gray-600">Name</label>
          <input className="w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Age</label>
          <input type="number" className="w-full rounded-md border px-3 py-2" value={age} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Price</label>
          <input type="number" className="w-full rounded-md border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Phone</label>
          <input className="w-full rounded-md border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Bio</label>
          <textarea className="w-full rounded-md border px-3 py-2" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Avatar URL</label>
          <input className="w-full rounded-md border px-3 py-2" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
      </div>
    </div>
  );
}