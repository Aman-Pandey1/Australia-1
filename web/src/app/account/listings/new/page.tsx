"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuthToken } from '../../../../lib/api';
import { getSession } from '../../../../lib/auth';
import { Button } from '../../../../components/ui/button';

export default function NewListingPage() {
  const router = useRouter();
  const session = getSession();
  if (session) setAuthToken(session.token);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | 'trans' | 'other' | ''>('');
  const [planType, setPlanType] = useState<'vip' | 'premium' | 'featured' | ''>('');
  const [planCities, setPlanCities] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      if (price !== '') form.append('price', String(price));
      form.append('contact', JSON.stringify({ city, phone }));
      form.append('stats', JSON.stringify({ gender }));
      if (planType) form.append('planType', planType);
      if (planCities) form.append('planCities', planCities);
      if (images) Array.from(images).forEach((f) => form.append('images', f));
      const { data } = await api.post('/listings', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.replace('/account/listings');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create listing');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Add Listing</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Title</label>
          <input className="w-full rounded-md border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Description</label>
          <textarea className="w-full rounded-md border px-3 py-2" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Price</label>
          <input type="number" className="w-full rounded-md border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">City</label>
          <input className="w-full rounded-md border px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Phone</label>
          <input className="w-full rounded-md border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Gender</label>
          <select className="w-full rounded-md border px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value as any)}>
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="trans">Trans</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Plan Type</label>
          <select className="w-full rounded-md border px-3 py-2" value={planType} onChange={(e) => setPlanType(e.target.value as any)}>
            <option value="">None</option>
            <option value="featured">Featured</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP (Homepage)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Plan Cities (comma-separated)</label>
          <input className="w-full rounded-md border px-3 py-2" value={planCities} onChange={(e) => setPlanCities(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-gray-600">Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
        </div>
        {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
}