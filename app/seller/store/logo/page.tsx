"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerStoreLogoPage() {
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      toast.error("Upload failed");
      return;
    }

    setLogo(data.imageUrl);
    toast.success("Logo uploaded");
  };

  const saveLogo = async () => {
    const seller = JSON.parse(
      localStorage.getItem("seller") || "{}"
    );

    if (!seller?.id) {
      toast.error("Please login again");
      return;
    }

    if (!logo) {
      toast.error("Upload logo first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: seller.id,
          store_logo: logo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Store logo saved");
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
        <Link
          href="/seller"
          className="text-blue-600 font-semibold"
        >
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Store Logo
          </h1>

          <p className="text-gray-500 mb-6">
            Upload your store logo.
          </p>

          <div className="border-2 border-dashed rounded-2xl p-10 text-center bg-gray-50">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-40 h-40 rounded-full object-cover border mx-auto mb-4"
              />
            ) : (
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4" />
            )}

            <p className="font-bold mb-2">
              Logo Upload
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Recommended Size: 500 × 500
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadLogo(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={saveLogo}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Logo"}
          </button>
        </div>
      </section>
    </main>
  );
}