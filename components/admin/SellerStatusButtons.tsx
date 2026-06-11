"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerStatusButtons({
  id,
}: {
  id: number;
}) {
  const router = useRouter();

  const [loadingStatus, setLoadingStatus] = useState("");

  const updateStatus = async (status: string) => {
    try {
      setLoadingStatus(status);

      const res = await fetch("/api/admin/sellers/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (data.success) {
        if (status === "Approved") {
          toast.success("Seller approved successfully");
        } else if (status === "Rejected") {
          toast.success("Seller rejected successfully");
        } else {
          toast.success("Seller marked as pending");
        }

        router.refresh();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoadingStatus("");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Approved")}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Approved"
          ? "Approving..."
          : "✅ Approve"}
      </button>

      <button
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Rejected")}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
      >
        {loadingStatus === "Rejected"
          ? "Rejecting..."
          : "❌ Reject"}
      </button>

      <button
        disabled={loadingStatus !== ""}
        onClick={() => updateStatus("Pending")}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold transition disabled:bg-gray-300"
      >
        {loadingStatus === "Pending"
          ? "Updating..."
          : "⏳ Mark Pending"}
      </button>
    </div>
  );
}