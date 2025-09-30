"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [actionMsg, setActionMsg] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/api/listings/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [id]);

  if (error) return <div className="p-6">{error}</div>;
  if (!data?.listing) return <div className="p-6">Loading...</div>;

  const l = data.listing;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{l.title}</h1>
      <p className="text-gray-700 mb-4">{l.description}</p>
      {!!actionMsg && (
        <div className="mb-3 text-sm text-blue-700">{actionMsg}</div>
      )}
      <div className="flex gap-2 mb-6">
        <button
          className="px-3 py-1 rounded border"
          onClick={async () => {
            const token = localStorage.getItem("token") || "";
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const r = await fetch(`${api}/api/favorites/${l._id}`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }});
            setActionMsg(r.ok ? 'Added to favorites' : 'Failed');
          }}
        >
          Add to favorites
        </button>
        <button
          className="px-3 py-1 rounded border"
          onClick={async () => {
            const token = localStorage.getItem("token") || "";
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const r = await fetch(`${api}/api/reports`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ listing: l._id, reason: 'Suspected fake profile' }) });
            setActionMsg(r.ok ? 'Reported as fake' : 'Failed');
          }}
        >
          Report fake
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h2 className="font-medium mb-1">Contact</h2>
          <div className="text-sm">
            <div>City: {l.contact?.city}</div>
            <div>Country: {l.contact?.country}</div>
            <div>Phone: {l.contact?.phone}</div>
            <div>Apps: {(l.contact?.apps || []).join(", ")}</div>
          </div>
        </div>
        <div>
          <h2 className="font-medium mb-1">Profile</h2>
          <div className="text-sm">
            <div>Gender: {l.profile?.gender}</div>
            <div>Age: {l.profile?.age}</div>
            <div>Eyes: {l.profile?.eyes}</div>
            <div>Hair: {l.profile?.hair}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

