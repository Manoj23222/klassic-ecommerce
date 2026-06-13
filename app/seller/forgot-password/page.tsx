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
        toast.success(data.message || "Password reset link sent");
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
    <main className="min-h-screen bg-[#f7f9fc]">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-extrabold text-gray-900">
            Klassic <span className="text-blue-600">Seller</span>
          </Link>

          <Link
            href="/seller/login"
            className="bg-black text-white px-6 py-3 rounded-xl font-extrabold shadow"
          >
            Login
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-bold text-blue-600 mb-3">
            Seller Account Recovery
          </p>

          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Reset Your Seller Password
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Apna registered seller Gmail enter karo. Password reset link email
            par send hoga.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Info icon="🔐" text="Secure reset link" />
            <Info icon="📧" text="Gmail verification" />
            <Info icon="🏪" text="Seller account access" />
            <Info icon="⚡" text="Quick recovery" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-4xl mb-4">
              🔑
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900">
              Forgot Password
            </h2>

            <p className="text-gray-500 mt-2">
              Enter your registered seller Gmail.
            </p>
          </div>

          <form onSubmit={sendResetLink} className="space-y-4">
            <input
              type="email"
              placeholder="Seller Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-blue-600"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-black to-blue-900 text-white py-4 rounded-2xl font-extrabold shadow-lg disabled:from-gray-400 disabled:to-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
            <h3 className="font-extrabold">Remember password?</h3>

            <Link
              href="/seller/login"
              className="inline-block mt-3 bg-yellow-400 text-black px-5 py-3 rounded-xl font-extrabold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="font-bold text-gray-800">{text}</p>
    </div>
  );
}