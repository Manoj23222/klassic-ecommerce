"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful");
      window.location.href = "/";
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3x1 font-bold mb-6">Login</h1>

        <form onSubmit={loginUser} className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Login
          </button>
        </form>
         <div className="mt-4 text-center">
  
</div>
<div className="flex justify-between mt-4 text-sm">
  <Link
    href="/forgot-password"
    className="text-blue-600 hover:underline"
  >
    Forgot Password?
  </Link>

  <Link
    href="/register"
    className="text-blue-600 hover:underline"
  >
    Create Account
  </Link>
</div>
      </div>

     
    </main>
  );
}