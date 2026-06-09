"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Account created successfully");
      window.location.href = "/login";
    } else {
alert(data.message || "Registration failed");    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <form onSubmit={registerUser} className="space-y-4">
          <input className="w-full border p-3 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full border p-3 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full border p-3 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}