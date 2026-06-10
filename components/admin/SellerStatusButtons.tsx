"use client";

import { useRouter } from "next/navigation";

export default function SellerStatusButtons({ id }: { id: number }) {
  const router = useRouter();

  const updateStatus = async (status: string) => {
    const res = await fetch("/api/admin/sellers/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`Seller ${status}`);
      router.refresh();
    } else {
      alert(data.message || "Update failed");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => updateStatus("Approved")}
        className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
      >
        Approve
      </button>

      <button
        onClick={() => updateStatus("Rejected")}
        className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
      >
        Reject
      </button>

      <button
        onClick={() => updateStatus("Pending")}
        className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-bold"
      >
        Mark Pending
      </button>
    </div>
  );
}