"use client";

import { useState } from "react";

export default function UpdateStockButton({
  id,
  currentStock,
}: {
  id: number;
  currentStock: number;
}) {
  const [stock, setStock] = useState(currentStock);

  const updateStock = async () => {
    const res = await fetch(`/api/admin/inventory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Stock updated");
      window.location.reload();
    } else {
      alert("Stock update failed");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="number"
        className="border p-2 rounded w-24"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      <button
        onClick={updateStock}
        className="bg-blue-600 text-white px-3 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}