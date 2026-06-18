"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerCouponManager() {
  const [seller, setSeller] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minOrder, setMinOrder] = useState("");

  async function loadCoupons(sellerId: string) {
    const res = await fetch(`/api/seller/marketing?seller_id=${sellerId}&type=Coupon`);
    const data = await res.json();
    if (data.success) setCoupons(data.items || []);
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
    loadCoupons(sellerId);
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
    toast.success("Coupon deleted");
    loadCoupons(sellerId);
  } else {
    toast.error(data.message || "Delete failed");
  }
}
  useEffect(() => {
    const savedSeller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = savedSeller?._id || savedSeller?.id;

    setSeller(savedSeller);
    if (sellerId) loadCoupons(sellerId);
  }, []);

  async function addCoupon() {
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return toast.error("Seller not found");
    if (!code || !discount) return toast.error("Code and discount required");

    const res = await fetch("/api/seller/marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: sellerId,
        seller_store_name: seller?.store_name || seller?.storeName || "Klassic Seller",
        type: "Coupon",
        title: code.toUpperCase(),
        couponCode: code.toUpperCase(),
        discount: Number(discount || 0),
        minOrder: Number(minOrder || 0),
        status: "Active",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Coupon saved");
      setCode("");
      setDiscount("");
      setMinOrder("");
      loadCoupons(sellerId);
    } else {
      toast.error(data.message || "Save failed");
    }
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Coupon Manager</h1>
        <p className="text-gray-500">Create seller discount coupons.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Create Coupon</h2>

          <Input label="Coupon Code" value={code} setValue={setCode} />
          <Input label="Discount %" value={discount} setValue={setDiscount} type="number" />
          <Input label="Minimum Order ₹" value={minOrder} setValue={setMinOrder} type="number" />

          <button
            onClick={addCoupon}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Save Coupon
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Saved Coupons</h2>

          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="rounded-2xl border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black">{coupon.couponCode || coupon.title}</p>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                    {coupon.status}
                  </span>
                </div>

                <p className="mt-2 text-sm font-bold text-gray-600">
                  {coupon.discount}% OFF
                </p>

                <p className="text-sm text-gray-500">
                  Min Order: ₹{coupon.minOrder || 0}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
  <button
    onClick={() => updateStatus(coupon._id, "Active")}
    className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white"
  >
    Active
  </button>

  <button
    onClick={() => updateStatus(coupon._id, "Paused")}
    className="rounded-xl bg-yellow-500 px-3 py-2 text-xs font-black text-white"
  >
    Pause
  </button>

  <button
    onClick={() => deleteItem(coupon._id)}
    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white"
  >
    Delete
  </button>
</div>
              </div>
              
            ))}

            {coupons.length === 0 && (
              <div className="rounded-2xl border bg-gray-50 p-10 text-center font-bold text-gray-500">
                No coupons saved
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
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}