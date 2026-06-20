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
  courierName = "",
  trackingNumber = "",
  deliveryEstimate = "",
}: {
  orderId: string;
  itemIndex: number;
  currentStatus: string;
  courierName?: string;
  trackingNumber?: string;
  deliveryEstimate?: string;
}) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus || "Pending");

  const [courier, setCourier] = useState(courierName);
  const [tracking, setTracking] = useState(trackingNumber);
  const [estimate, setEstimate] = useState(deliveryEstimate);

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

          courier_name: courier,
          tracking_number: tracking,
          delivery_estimate: estimate,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success("Shipment updated");

      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500">
          Order Status
        </p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-gray-300 p-3 font-bold"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500">
          Courier Name
        </p>

        <input
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          placeholder="BlueDart / Delhivery / Xpressbees"
          className="w-full rounded-xl border border-gray-300 p-3"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500">
          Tracking Number
        </p>

        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking ID"
          className="w-full rounded-xl border border-gray-300 p-3"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-gray-500">
          Delivery Estimate
        </p>

        <input
          type="date"
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
          className="w-full rounded-xl border border-gray-300 p-3"
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={updateStatus}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Save Shipment"}
      </button>
    </div>
  );
}