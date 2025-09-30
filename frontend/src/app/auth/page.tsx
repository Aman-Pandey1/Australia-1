"use client";

import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body: any = { email, password };
    if (mode === "register") body.name = name;
    const res = await fetch(api + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data?.message || "Failed");
    localStorage.setItem("token", data.token);
    setMessage("Success");
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{mode === "login" ? "Login" : "Register"}</h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white rounded px-4 py-2 w-full">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-blue-600"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
}

