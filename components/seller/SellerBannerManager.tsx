"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerBannerManager() {
  const [seller, setSeller] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [banners, setBanners] = useState<any[]>([]);

  async function loadBanners(sellerId: string) {
    const res = await fetch(`/api/seller/marketing?seller_id=${sellerId}&type=Banner`);
    const data = await res.json();

    if (data.success) {
      setBanners(data.items || []);
    }
  }
async function updateStatus(itemId: string, status: string) {
  const sellerId = seller?._id || seller?.id;

  const res = await fetch("/api/seller/marketing", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item_id: itemId,
      seller_id: sellerId,
      status,
    }),
  });

  const data = await res.json();

  if (data.success) {
    toast.success("Status updated");
    loadBanners(sellerId);
  } else {
    toast.error(data.message || "Update failed");
  }
}

async function deleteItem(itemId: string) {
  const sellerId = seller?._id || seller?.id;

  const res = await fetch(
    `/api/seller/marketing?item_id=${itemId}&seller_id=${sellerId}`,
    { method: "DELETE" }
  );

  const data = await res.json();

  if (data.success) {
    toast.success("Banner deleted");
    loadBanners(sellerId);
  } else {
    toast.error(data.message || "Delete failed");
  }
}
  useEffect(() => {
    const savedSeller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = savedSeller?._id || savedSeller?.id;

    setSeller(savedSeller);

    if (sellerId) {
      loadBanners(sellerId);
    }
  }, []);

  async function addBanner() {
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    if (!title || !imageUrl) {
      toast.error("Title and image required");
      return;
    }

    const res = await fetch("/api/seller/marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: sellerId,
        seller_store_name: seller?.store_name || seller?.storeName || "Klassic Seller",
        type: "Banner",
        title,
        imageUrl,
        link,
        status: "Draft",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Banner saved");
      setTitle("");
      setImageUrl("");
      setLink("");
      loadBanners(sellerId);
    } else {
      toast.error(data.message || "Save failed");
    }
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Banner Manager</h1>
        <p className="text-gray-500">Create store banners and promotion visuals.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Create Banner</h2>

          <Input label="Banner Title" value={title} setValue={setTitle} />
          <Input label="Image URL" value={imageUrl} setValue={setImageUrl} />
          <Input label="Target Link" value={link} setValue={setLink} />

          <button
            onClick={addBanner}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Save Banner
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Saved Banners</h2>

          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner._id} className="overflow-hidden rounded-3xl border">
                <img
                  src={banner.imageUrl || "/placeholder.png"}
                  alt={banner.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-black">{banner.title}</h3>
                  <p className="text-sm text-gray-500">{banner.link || "No link"}</p>
                  <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                    {banner.status}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
  <button
    onClick={() => updateStatus(banner._id, "Active")}
    className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white"
  >
    Active
  </button>

  <button
    onClick={() => updateStatus(banner._id, "Paused")}
    className="rounded-xl bg-yellow-500 px-3 py-2 text-xs font-black text-white"
  >
    Pause
  </button>

  <button
    onClick={() => deleteItem(banner._id)}
    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white"
  >
    Delete
  </button>
</div>
                </div>
              </div>
            ))}


            {banners.length === 0 && (
              <div className="rounded-2xl border bg-gray-50 p-10 text-center font-bold text-gray-500">
                No banners saved
              </div>
            )}
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}