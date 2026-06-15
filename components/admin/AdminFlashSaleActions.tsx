"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminFlashSaleActions({
  saleId,
  active,
}: {
  saleId: string;
  active: boolean;
}) {
  const router = useRouter();

  const toggleSale = async () => {
    const res = await fetch(`/api/admin/flash-sales/${saleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const deleteSale = async () => {
    if (!confirm("Delete this flash sale?")) return;

    const res = await fetch(`/api/admin/flash-sales/${saleId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message || "Delete failed");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={toggleSale}
        className={`px-3 py-2 rounded-lg text-sm font-bold ${
          active
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {active ? "Deactivate" : "Activate"}
      </button>

      <button
        onClick={deleteSale}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
      >
        Delete
      </button>
    </div>
  );
}