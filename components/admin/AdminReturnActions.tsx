"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminReturnActions({
  order,
}: {
  order: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateReturn(return_status: "Approved" | "Rejected") {
    const ok = confirm(`Mark return as ${return_status}?`);
    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/admin/returns/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_status,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message || "Return update failed");
      return;
    }

    toast.success(data.message || "Return updated");
    router.refresh();
  }

  async function updateRefund(refund_status: "Completed" | "Rejected") {
    const ok = confirm(`Mark refund as ${refund_status}?`);
    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/admin/refunds/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refund_status,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message || "Refund update failed");
      return;
    }

    toast.success(data.message || "Refund updated");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-lg font-black">Return Control</h3>

      <div className="mt-4 space-y-2 text-sm">
        <p>
          Return Status: <b>{order.return_status}</b>
        </p>
        <p>
          Refund Status: <b>{order.refund_status}</b>
        </p>
        <p>
          Payment Status: <b>{order.payment_status}</b>
        </p>
        <p>
          Refund Amount:{" "}
          <b>₹{Number(order.refund_amount || order.total_amount || 0).toFixed(0)}</b>
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {order.return_status === "Requested" && (
          <>
            <button
              disabled={loading}
              onClick={() => updateReturn("Approved")}
              className="w-full rounded-full bg-green-600 py-3 text-sm font-black text-white disabled:bg-gray-400"
            >
              Approve Return
            </button>

            <button
              disabled={loading}
              onClick={() => updateReturn("Rejected")}
              className="w-full rounded-full bg-red-600 py-3 text-sm font-black text-white disabled:bg-gray-400"
            >
              Reject Return
            </button>
          </>
        )}

        {order.return_status === "Approved" &&
          order.refund_status === "Pending" && (
            <>
              <button
                disabled={loading}
                onClick={() => updateRefund("Completed")}
                className="w-full rounded-full bg-black py-3 text-sm font-black text-white disabled:bg-gray-400"
              >
                Mark Refund Completed
              </button>

              <button
                disabled={loading}
                onClick={() => updateRefund("Rejected")}
                className="w-full rounded-full bg-orange-600 py-3 text-sm font-black text-white disabled:bg-gray-400"
              >
                Reject Refund
              </button>
            </>
          )}

        {order.refund_status === "Completed" && (
          <div className="rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
            Refund completed successfully.
          </div>
        )}

        {order.return_status === "Rejected" && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
            Return request rejected.
          </div>
        )}
      </div>
    </div>
  );
}