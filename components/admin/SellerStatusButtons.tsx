"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerStatusButtons({ id }: { id: string }) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState("");

  const updateStatus = async (status: string) => {
    try {
      setLoadingStatus(status);

      const res = await fetch("/api/admin/sellers/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success(`Seller status changed to ${status}`);
      router.refresh();
    } catch {
      toast.error("Server error");
    } finally {
      setLoadingStatus("");
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Approved")}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-extrabold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Approved" ? "Approving..." : "✅ Approve Seller"}
      </button>

      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Rejected")}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-extrabold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Rejected" ? "Rejecting..." : "❌ Reject Seller"}
      </button>

      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Suspended")}
        className="w-full bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-2xl font-extrabold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Suspended" ? "Suspending..." : "⛔ Suspend Seller"}
      </button>

      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Pending")}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-3 rounded-2xl font-extrabold transition disabled:bg-gray-300"
      >
        {loadingStatus === "Pending" ? "Updating..." : "⏳ Mark Pending"}
      </button>
    </div>
  );
}