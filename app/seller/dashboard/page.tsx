"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Seller = {
  id: string;
  name: string;
  email: string;
  store_name: string;
  status: string;
};

export default function SellerDashboardPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedSeller = localStorage.getItem("seller");

    if (!savedSeller) {
      toast.error("Please login to Seller Hub first");
      window.location.href = "/seller/login";
      return;
    }

    try {
      const parsedSeller = JSON.parse(savedSeller);

      if (!parsedSeller?.id || parsedSeller?.status !== "Approved") {
        localStorage.removeItem("seller");
        toast.error("Seller access not allowed");
        window.location.href = "/seller/login";
        return;
      }

      setSeller(parsedSeller);
    } catch {
      localStorage.removeItem("seller");
      toast.error("Invalid seller session");
      window.location.href = "/seller/login";
    } finally {
      setChecking(false);
    }
  }, []);

  const logoutSeller = () => {
    localStorage.removeItem("seller");
    toast.success("Seller logged out");

    setTimeout(() => {
      window.location.href = "/seller/login";
    }, 800);
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-6 font-bold">
          Checking seller access...
        </div>
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-sm opacity-90">
            Welcome to Klassic Seller Hub
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            {seller.store_name || seller.name}
          </h1>

          <p className="mt-2 text-sm opacity-90">
            {seller.email}
          </p>

          <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold">
            ✅ {seller.status}
          </span>
        </div>

        <button
          type="button"
          onClick={logoutSeller}
          className="bg-white text-blue-700 px-5 py-3 rounded-xl font-extrabold hover:bg-blue-50 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <Link
          href="/seller/products/add"
          className="bg-white rounded-2xl shadow p-6 border hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">➕</div>
          <h2 className="text-xl font-extrabold">Add Product</h2>
          <p className="text-sm text-gray-500 mt-2">
            Upload product details for admin approval.
          </p>
        </Link>

        <Link
          href="/seller/products"
          className="bg-white rounded-2xl shadow p-6 border hover:shadow-lg transition"
        >
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-xl font-extrabold">My Products</h2>
          <p className="text-sm text-gray-500 mt-2">
            View and manage products submitted by your store.
          </p>
        </Link>

        <div className="bg-white rounded-2xl shadow p-6 border">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-xl font-extrabold">Seller Status</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your account is approved and ready to sell.
          </p>
        </div>
      </div>
    </div>
  );
}