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

  const updateReturn = async (return_status: "Approved" | "Rejected") => {
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
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Action failed");
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Admin note optional"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          onClick={() => updateReturn("Approved")}
          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
        >
          Approve Return
        </button>

        <button
          onClick={() => updateReturn("Rejected")}
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
        >
          Reject
        </button>
      </div>
    </div>
  );
}