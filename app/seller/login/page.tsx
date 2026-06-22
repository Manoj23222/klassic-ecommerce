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
        }, 800);
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
    <main className="min-h-screen bg-[#f7f9fc]">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-extrabold text-gray-900">
            Klassic <span className="text-blue-600">Seller</span>
          </Link>

          <Link
            href="/seller/register"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-extrabold shadow"
          >
            Create Account
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-bold text-blue-600 mb-3">
            Seller Hub Login
          </p>

          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Login to Klassic Seller Hub
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Products manage karo, orders track karo, earnings dekho aur
            AI seller tools ke sath apna business grow karo.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Info icon="📦" text="Product Management" />
            <Info icon="🚚" text="Order Tracking" />
            <Info icon="💰" text="Earnings Dashboard" />
            <Info icon="🤖" text="AI Growth Tools" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-4xl mb-4">
              🏪
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900">
              Seller Login
            </h2>

            <p className="text-gray-500 mt-2">
              Approved sellers can access their dashboard.
            </p>
          </div>

          <form onSubmit={loginSeller} className="space-y-4">
            <input
              type="email"
              placeholder="Seller Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-blue-600"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-2xl outline-none focus:border-blue-600"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-black to-blue-900 text-white py-4 rounded-2xl font-extrabold shadow-lg disabled:from-gray-400 disabled:to-gray-400"
            >
              {loading ? "Signing In..." : "Login"}
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
              Create Account
            </Link>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
            <h3 className="font-extrabold">New Seller?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create account, verify Gmail OTP, submit details and wait for
              admin approval.
            </p>

            <Link
              href="/seller/register"
              className="inline-block mt-4 bg-yellow-400 text-black px-5 py-3 rounded-xl font-extrabold"
            >
              Start Selling
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