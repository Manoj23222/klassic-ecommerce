"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminRefundAction({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");

  const completeRefund = async () => {
    const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refund_amount: amount,
        refund_note: note || "Refund completed",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Refund failed");
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Refund note optional"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <button
        onClick={completeRefund}
        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
      >
        Mark Refund Completed
      </button>
    </div>
  );
}