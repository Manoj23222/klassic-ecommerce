"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function SellerResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/seller/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password reset successful");

        setTimeout(() => {
          router.push("/seller/login");
        }, 1500);
      } else {
        toast.error(data.message || "Reset failed");
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold">
            Klassic <span className="text-blue-600">Seller</span>
          </Link>

          <Link
            href="/seller/login"
            className="bg-black text-white px-6 py-3 rounded-xl font-bold"
          >
            Login
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-600 font-bold mb-3">
            Seller Account Recovery
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            Create New Password
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Enter a strong password to secure your seller account.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-4xl mx-auto mb-4">
              🔑
            </div>

            <h2 className="text-3xl font-extrabold">
              Reset Password
            </h2>

            <p className="text-gray-500 mt-2">
              Create a new secure password
            </p>
          </div>

          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-2xl"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-gray-200 p-4 rounded-2xl"
            />

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-black to-blue-900 text-white py-4 rounded-2xl font-extrabold"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/seller/login" className="text-blue-600 font-bold">
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SellerResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold">
          Loading reset page...
        </div>
      }
    >
      <SellerResetPasswordContent />
    </Suspense>
  );
}