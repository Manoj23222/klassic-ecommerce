"use client";

import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerStoreBannerPage() {
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadBanner = async (file: File) => {
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

    setBanner(data.imageUrl);
    toast.success("Banner uploaded");
  };

  const saveBanner = async () => {
    const seller = JSON.parse(
      localStorage.getItem("seller") || "{}"
    );

    if (!seller?.id) {
      toast.error("Please login again");
      return;
    }

    if (!banner) {
      toast.error("Upload banner first");
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
          store_banner: banner,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Store banner saved");
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
            Store Banner
          </h1>

          <p className="text-gray-500 mb-6">
            Upload your seller store banner image.
          </p>

          <div className="border-2 border-dashed rounded-2xl p-10 text-center bg-gray-50">
            {banner ? (
              <img
                src={banner}
                alt="Banner"
                className="w-full h-52 object-cover rounded-xl border mb-4"
              />
            ) : (
              <div className="w-full h-52 bg-gray-200 rounded-xl mb-4" />
            )}

            <p className="font-bold mb-2">
              Banner Upload
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Recommended Size: 1200 × 300 px
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadBanner(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={saveBanner}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </section>
    </main>
  );
}