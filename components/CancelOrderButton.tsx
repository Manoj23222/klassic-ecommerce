"use client";

import toast from "react-hot-toast";
import { useState } from "react";

export default function CancelOrderButton({
  orderId,
}: {
  orderId: number;
}) {
  const [loading, setLoading] = useState(false);

  const cancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      setLoading(true);

      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order cancelled successfully");

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Cancel failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={cancelOrder}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition disabled:bg-gray-400"
    >
      {loading ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}