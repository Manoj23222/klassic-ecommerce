"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  const nextStatus =
    currentStatus === "Pending"
      ? "Shipped"
      : currentStatus === "Shipped"
      ? "Delivered"
      : "Delivered";

  const updateStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status: nextStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Order marked as ${nextStatus}`);

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Status update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "Delivered") {
    return (
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-2 font-extrabold">
        ✅ Order Delivered
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={updateStatus}
      disabled={loading}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
    >
      {loading ? "Updating..." : `Mark as ${nextStatus}`}
    </button>
  );
}