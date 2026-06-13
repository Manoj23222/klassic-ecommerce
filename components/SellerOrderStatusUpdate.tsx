"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
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
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/seller/orders/status", {
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

      if (!data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success("Order status updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[220px]">
      <p className="text-sm text-gray-500 mb-2">Update Status</p>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-3 rounded-xl w-full mb-3"
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
        className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold w-full disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}