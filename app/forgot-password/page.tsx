"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    alert(data.message || "Request sent");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>

        <form onSubmit={sendResetLink} className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Send Reset Link
          </button>
        </form>

        <Link href="/login" className="block mt-4 text-blue-600">
          Back to Login
        </Link>
      </div>
    </main>
  );
}