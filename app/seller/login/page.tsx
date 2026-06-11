"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SellerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSeller = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Enter seller email");
    if (!password.trim()) return toast.error("Enter password");

    try {
      setLoading(true);

      const res = await fetch("/api/seller/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("seller", JSON.stringify(data.seller));

        toast.success(`Welcome ${data.seller.store_name || data.seller.name}`);

        setTimeout(() => {
          router.push("/seller/dashboard");
        }, 1200);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl mb-4">
            🏪
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Seller Login
          </h1>

          <p className="text-gray-500 mt-2">
            Access your Klassic Seller Hub
          </p>
        </div>

        <form onSubmit={loginSeller} className="space-y-4">
          <input
            type="email"
            placeholder="Seller Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-extrabold hover:opacity-95 transition disabled:from-gray-400 disabled:to-gray-400"
          >
            {loading ? "Signing In..." : "Login to Seller Hub"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-5 text-sm">
          <Link
            href="/seller/forgot-password"
            className="text-blue-600 font-bold hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            href="/seller/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </main>
  );
}