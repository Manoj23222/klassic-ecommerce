"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminCustomerActions({
  customerId,
  status,
}: {
  customerId: string;
  status: string;
}) {
  const router = useRouter();

  const updateStatus = async (newStatus: "Active" | "Blocked") => {
    const res = await fetch(`/api/admin/customers/${customerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Action failed");
    }
  };

  return status === "Blocked" ? (
    <button
      onClick={() => updateStatus("Active")}
      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
    >
      Activate
    </button>
  ) : (
    <button
      onClick={() => updateStatus("Blocked")}
      className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
    >
      Block
    </button>
  );
}