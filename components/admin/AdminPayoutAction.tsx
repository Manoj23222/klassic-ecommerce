"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminPayoutAction({
  payoutId,
}: {
  payoutId: string;
}) {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");

  const markPaid = async () => {
    const res = await fetch(`/api/admin/payouts/${payoutId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Paid",
        transaction_id: transactionId,
        note: note || "Payout paid by admin",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Payout failed");
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        placeholder="Transaction ID"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note optional"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <button
        onClick={markPaid}
        className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm"
      >
        Mark Paid
      </button>
    </div>
  );
}