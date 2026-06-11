"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ReviewForm({
  productId,
  orderId,
  defaultName = "",
}: {
  productId: number;
  orderId?: number;
  defaultName?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Please write a short review");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, orderId, name, rating, comment }),
      });

      let data: any = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        toast.success("Review added successfully");
        setComment("");

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.error || "Review failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitReview}
      className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-gray-900">
          Rate & Review
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          Share your shopping experience with other Klassic customers.
        </p>
      </div>

      <input
        className="w-full border p-3 rounded-xl mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        className="w-full border p-3 rounded-xl mb-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
        <option value={4}>⭐⭐⭐⭐ Very Good</option>
        <option value={3}>⭐⭐⭐ Good</option>
        <option value={2}>⭐⭐ Average</option>
        <option value={1}>⭐ Poor</option>
      </select>

      <textarea
        className="w-full border p-3 rounded-xl mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        required
      />

      <button
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}