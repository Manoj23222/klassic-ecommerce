"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function UpdateStockButton({
  id,
  currentStock,
}: {
  id: number;
  currentStock: number;
}) {
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);

  const updateStock = async () => {
    if (stock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Stock updated successfully");

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Stock update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        className="border p-2 rounded-xl w-24 outline-none focus:ring-2 focus:ring-blue-500"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      <button
        type="button"
        onClick={updateStock}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}