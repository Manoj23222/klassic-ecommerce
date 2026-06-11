"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return toast.error("Invalid reset token");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    try {
      setLoading(true);

      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully");

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        toast.error(data.message || "Password update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={resetPassword}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>

        <p className="text-sm text-gray-500 mb-6">
          Create a new password for your Klassic account.
        </p>

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-xl font-bold disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}