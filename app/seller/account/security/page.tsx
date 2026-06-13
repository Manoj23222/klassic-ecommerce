"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerSecurityPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.currentPassword) {
      return toast.error("Current password required");
    }

    if (form.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const seller = JSON.parse(
      localStorage.getItem("seller") || "{}"
    );

    if (!seller?.id) {
      return toast.error("Please login again");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: seller.id,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password updated successfully");

        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Password update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/seller"
          className="text-blue-600 font-semibold"
        >
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Security Settings
          </h1>

          <p className="text-gray-500 mb-6">
            Change seller account password and security settings.
          </p>

          <form
            onSubmit={updatePassword}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  currentPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-8 border rounded-2xl p-5 bg-red-50">
            <h3 className="font-bold text-red-700 mb-2">
              Security Tips
            </h3>

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use a strong password.</li>
              <li>Never share login credentials.</li>
              <li>Change password regularly.</li>
              <li>Use different passwords for different accounts.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}