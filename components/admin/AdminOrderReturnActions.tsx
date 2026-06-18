"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminOrderReturnActions({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const updateReturn = async (return_status: "Approved" | "Rejected") => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}/return`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          return_status,
          refund_amount: amount,
          refund_note: note,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Return updated");
        router.refresh();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
          Admin Note
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for return/refund decision..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-black"
        />
      </div>

      <div className="rounded-2xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
          Refund Amount
        </p>

        <p className="mt-1 text-2xl font-black">
          ₹{Number(amount || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => updateReturn("Approved")}
          className="rounded-full bg-green-600 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Approve Return"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => updateReturn("Rejected")}
          className="rounded-full bg-red-600 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Reject Return"}
        </button>
      </div>
    </div>
  );
}