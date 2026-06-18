"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statuses = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

export default function SellerOrderStatusUpdate({
  orderId,
  itemIndex,
  currentStatus,
}: {
  orderId: string;
  itemIndex: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "Pending");
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/seller/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          item_index: itemIndex,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success("Order status updated");
      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-gray-500">Update Status</p>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-3 w-full rounded-xl border p-3 font-bold"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={loading}
        onClick={updateStatus}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}