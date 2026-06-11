"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SellerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Enter seller Gmail");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/seller/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          data.message || "Password reset link sent successfully"
        );
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔑</div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Seller Password Reset
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your seller Gmail address
          </p>
        </div>

        <form onSubmit={sendResetLink} className="space-y-4">
          <input
            type="email"
            placeholder="Seller Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Password Reset Link"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            href="/seller/login"
            className="text-blue-600 font-bold hover:underline"
          >
            ← Back to Seller Login
          </Link>
        </div>
      </div>
    </main>
  );
}