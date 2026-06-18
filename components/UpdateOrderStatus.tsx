"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

const statusList: OrderStatus[] = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          payment_status: paymentStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success("Order status updated");

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-gray-600">
          Order Status
        </span>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-xl border p-3 font-bold"
        >
          {statusList.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-gray-600">
          Payment Status
        </span>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full rounded-xl border p-3 font-bold"
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
      </label>

      <button
        type="button"
        onClick={updateStatus}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update Order"}
      </button>
    </div>
  );
}