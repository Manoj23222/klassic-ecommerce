"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerGSTPage() {
  const [sellerId, setSellerId] = useState("");

  const [form, setForm] = useState({
    gst_number: "",
    pan_number: "",
    business_name: "",
    business_address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sellerData = localStorage.getItem("seller");

    if (!sellerData) {
      toast.error("Please login first");
      return;
    }

    const seller = JSON.parse(sellerData);
    setSellerId(seller._id || seller.id);
  }, []);

  const saveGST = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/gst", {
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
        toast.success("GST details saved");
      } else {
        toast.error(data.message || "Save failed");
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
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            GST Details
          </h1>

          <p className="text-gray-500 mb-6">
            Manage GST and business tax information.
          </p>

          <form onSubmit={saveGST} className="space-y-4">
            <input
              type="text"
              placeholder="GST Number"
              value={form.gst_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  gst_number: e.target.value.toUpperCase(),
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="PAN Number"
              value={form.pan_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  pan_number: e.target.value.toUpperCase(),
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Business Name"
              value={form.business_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  business_name: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              placeholder="Business Address"
              value={form.business_address}
              onChange={(e) =>
                setForm({
                  ...form,
                  business_address: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl h-28"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save GST Details"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}