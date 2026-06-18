"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminSellerActions({
  sellerId,
  status,
}: {
  sellerId: string;
  status: string;
}) {
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(
      `/api/admin/sellers/${sellerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {status !== "Approved" && (
        <button
          onClick={() => updateStatus("Approved")}
          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
        >
          Approve
        </button>
      )}

      {status !== "Rejected" && (
        <button
          onClick={() => updateStatus("Rejected")}
          className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
        >
          Reject
        </button>
      )}

      {status !== "Suspended" && (
        <button
          onClick={() => updateStatus("Suspended")}
          className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs"
        >
          Suspend
        </button>
      )}
    </div>
  );
}   