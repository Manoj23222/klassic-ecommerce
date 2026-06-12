"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [loading, setLoading] = useState(false);

  const nextStatus: OrderStatus =
    currentStatus === "Pending"
      ? "Processing"
      : currentStatus === "Processing"
      ? "Shipped"
      : currentStatus === "Shipped"
      ? "Delivered"
      : currentStatus;

  const updateStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success(`Order marked as ${nextStatus}`);

      setTimeout(() => {
        window.location.reload();
      }, 800);
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

  if (currentStatus === "Cancelled") {
    return (
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-4 py-2 font-extrabold">
        ❌ Order Cancelled
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