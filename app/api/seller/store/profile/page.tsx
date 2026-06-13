"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function StoreProfilePage() {
  const [form, setForm] = useState({
    store_name: "",
    store_description: "",
    store_logo: "",
    store_banner: "",
    store_email: "",
    store_phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch seller store profile
    const fetchStore = async () => {
      try {
        const res = await fetch("/api/seller/profile");
        const data = await res.json();
        if (data.success) setForm(data.store);
      } catch (err) {
        toast.error("Failed to load store profile");
      }
    };
    fetchStore();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/seller/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) toast.success(data.message);
      else toast.error(data.message || "Update failed");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">Store Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Store Name"
            value={form.store_name}
            onChange={(e) =>
              setForm({ ...form, store_name: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            placeholder="Store Description"
            value={form.store_description}
            onChange={(e) =>
              setForm({ ...form, store_description: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
            rows={4}
          />

          <input
            type="email"
            placeholder="Store Email"
            value={form.store_email}
            onChange={(e) =>
              setForm({ ...form, store_email: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Store Phone"
            value={form.store_phone}
            onChange={(e) =>
              setForm({ ...form, store_phone: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Store Logo URL"
            value={form.store_logo}
            onChange={(e) =>
              setForm({ ...form, store_logo: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Store Banner URL"
            value={form.store_banner}
            onChange={(e) =>
              setForm({ ...form, store_banner: e.target.value })
            }
            className="w-full border p-3 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-xl font-bold w-full disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Store Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}