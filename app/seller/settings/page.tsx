"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerStoreSettingsPage() {
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    store_visibility: "Public",
    return_policy: "",
    shipping_policy: "",
    auto_approve_orders: false,
  });

  useEffect(() => {
    const sellerData = localStorage.getItem("seller");

    if (!sellerData) return;

    const seller = JSON.parse(sellerData);

    setSellerId(seller._id || seller.id);
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: sellerId,
          ...form,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Store settings updated");
      } else {
        toast.error(data.message || "Update failed");
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

      <section className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/seller"
          className="text-blue-600 font-semibold"
        >
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Store Settings
          </h1>

          <p className="text-gray-500 mb-6">
            Manage store preferences and policies.
          </p>

          <form
            onSubmit={saveSettings}
            className="space-y-5"
          >
            <div>
              <label className="font-semibold block mb-2">
                Store Visibility
              </label>

              <select
                value={form.store_visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    store_visibility: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Return Policy
              </label>

              <textarea
                value={form.return_policy}
                onChange={(e) =>
                  setForm({
                    ...form,
                    return_policy: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl h-32"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Shipping Policy
              </label>

              <textarea
                value={form.shipping_policy}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shipping_policy: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl h-32"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.auto_approve_orders}
                onChange={(e) =>
                  setForm({
                    ...form,
                    auto_approve_orders: e.target.checked,
                  })
                }
              />

              <span className="font-semibold">
                Auto Approve Orders
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}