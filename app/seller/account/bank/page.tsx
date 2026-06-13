"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerBankPage() {
  const [sellerId, setSellerId] = useState("");

  const [form, setForm] = useState({
    bank_account_holder: "",
    bank_name: "",
    bank_account_number: "",
    bank_ifsc: "",
    upi_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sellerData = localStorage.getItem("seller");

    if (!sellerData) {
      toast.error("Please login first");
      return;
    }

    const seller = JSON.parse(sellerData);
    const id = seller._id || seller.id;

    setSellerId(id);
  }, []);

  const saveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/bank", {
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
        toast.success("Bank details saved");
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
          <h1 className="text-3xl font-bold mb-2">Bank Details</h1>

          <p className="text-gray-500 mb-6">
            Add bank account details for settlements and withdrawals.
          </p>

          <form onSubmit={saveBankDetails} className="space-y-4">
            <input
              type="text"
              placeholder="Account Holder Name"
              value={form.bank_account_holder}
              onChange={(e) =>
                setForm({ ...form, bank_account_holder: e.target.value })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Bank Name"
              value={form.bank_name}
              onChange={(e) =>
                setForm({ ...form, bank_name: e.target.value })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Account Number"
              value={form.bank_account_number}
              onChange={(e) =>
                setForm({ ...form, bank_account_number: e.target.value })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="IFSC Code"
              value={form.bank_ifsc}
              onChange={(e) =>
                setForm({ ...form, bank_ifsc: e.target.value.toUpperCase() })
              }
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="UPI ID Optional"
              value={form.upi_id}
              onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
              className="w-full border p-3 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Bank Details"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}