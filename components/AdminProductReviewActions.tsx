"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminProductReviewActions({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && rejectReason.trim().length < 3) {
      toast.error("Reject reason required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/products/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          status,
          reject_reason: status === "Rejected" ? rejectReason : "",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Status update failed");
        return;
      }

      toast.success(data.message || "Product status updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-3">Admin Action</h2>

      <p className="text-sm text-gray-600 mb-4">
        Current Status: <b>{currentStatus}</b>
      </p>

      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Reject reason लिखो अगर product reject करना है"
        className="w-full border p-3 rounded-xl mb-4"
        rows={3}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("Approved")}
          className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold disabled:bg-gray-400"
        >
          Approve Product
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("Rejected")}
          className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold disabled:bg-gray-400"
        >
          Reject Product
        </button>
      </div>
    </div>
  );
}