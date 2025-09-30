"use client";

import { useState } from "react";

export default function NewListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${api}/api/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data?.message || "Failed");
    setMessage("Created (pending approval)");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Listing</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <button className="bg-black text-white rounded px-4 py-2">Create</button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </form>
    </div>
  );
}

