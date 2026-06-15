"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductApprovalActions({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectReason.trim()) {
      toast.error("Please enter reject reason");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/products/${productId}/approval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        reject_reason: rejectReason,
        approval_comment:
          status === "Approved"
            ? "Product approved by admin"
            : "Product rejected by admin",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success(data.message);
      setRejectReason("");
      router.refresh();
    } else {
      toast.error(data.message || "Action failed");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Reject reason लिखें अगर reject करना है..."
        className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={loading}
          onClick={() => updateStatus("Approved")}
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          Approve
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("Rejected")}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}