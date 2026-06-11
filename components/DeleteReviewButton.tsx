"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteReviewButton({
  id,
}: {
  id: number;
}) {
  const [loading, setLoading] = useState(false);

  const deleteReview = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Review deleted successfully");

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={deleteReview}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition disabled:bg-gray-400"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}