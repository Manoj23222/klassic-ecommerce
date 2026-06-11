"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Reset link sent successfully");
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>

        <p className="text-sm text-gray-500 mb-6">
          Enter your Gmail to receive reset link.
        </p>

        <form onSubmit={sendResetLink} className="space-y-4">
          <input
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Gmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <Link href="/login" className="block mt-4 text-blue-600 font-semibold">
          Back to Login
        </Link>
      </div>
    </main>
  );
}