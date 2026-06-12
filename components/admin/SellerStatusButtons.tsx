"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerStatusButtons({
  id,
}: {
  id: string;
}) {
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
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success(`Seller ${status.toLowerCase()} successfully`);
      router.refresh();
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingStatus("");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Approved")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Approved" ? "Approving..." : "✅ Approve"}
      </button>

      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Rejected")}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Rejected" ? "Rejecting..." : "❌ Reject"}
      </button>

      <button
        type="button"
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Pending")}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-300"
      >
        {loadingStatus === "Pending" ? "Updating..." : "⏳ Mark Pending"}
      </button>
    </div>
  );
}