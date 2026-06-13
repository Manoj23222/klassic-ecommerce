"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerStoreProfilePage() {
  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    store_name: "",
    store_description: "",
    support_email: "",
    support_phone: "",
    store_logo: "",
    store_banner: "",
  });

  useEffect(() => {
    const loadSeller = async () => {
      const sellerData = localStorage.getItem("seller");

      if (!sellerData) return;

      const seller = JSON.parse(sellerData);
      const id = seller._id || seller.id;

      setSellerId(id);

      try {
        const res = await fetch(
          `/api/seller/profile?seller_id=${id}`
        );

        const data = await res.json();

        if (data.success && data.seller) {
          setForm({
            store_name: data.seller.store_name || "",
            store_description:
              data.seller.store_description || "",
            support_email:
              data.seller.support_email || "",
            support_phone:
              data.seller.support_phone || "",
            store_logo:
              data.seller.store_logo || "",
            store_banner:
              data.seller.store_banner || "",
          });
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    loadSeller();
  }, []);

  const updateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/seller/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_id: sellerId,
            ...form,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Store profile updated"
        );
      } else {
        toast.error(
          data.message || "Update failed"
        );
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
            Store Profile
          </h1>

          <p className="text-gray-500 mb-6">
            Manage your store details.
          </p>

          {form.store_banner && (
            <img
              src={form.store_banner}
              alt="Banner"
              className="w-full h-52 object-cover rounded-xl border mb-6"
            />
          )}

          <div className="flex justify-center mb-6">
            {form.store_logo ? (
              <img
                src={form.store_logo}
                alt="Logo"
                className="w-32 h-32 rounded-full border object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full" />
            )}
          </div>

          <form
            onSubmit={updateProfile}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Store Name"
              value={form.store_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  store_name: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              placeholder="Store Description"
              value={form.store_description}
              onChange={(e) =>
                setForm({
                  ...form,
                  store_description:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl h-32"
            />

            <input
              type="email"
              placeholder="Support Email"
              value={form.support_email}
              onChange={(e) =>
                setForm({
                  ...form,
                  support_email:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Support Phone"
              value={form.support_phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  support_phone:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}