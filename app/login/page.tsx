"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const registered = searchParams.get("registered");
    const email = searchParams.get("email");

    if (registered === "true") {
      toast.success("Welcome to Klassic! Account created successfully.");
    }

    if (email) setIdentifier(email);
  }, [searchParams]);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) return toast.error("Enter Gmail or mobile number");
    if (!password.trim()) return toast.error("Enter password");

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful. Redirecting...");

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Login</h1>

        <p className="text-sm text-gray-500 mb-5">
          Login to continue shopping on Klassic.
        </p>

        <form onSubmit={loginUser} className="space-y-4">
          <input
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Gmail or Mobile Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <input
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>

          <Link href="/register" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}