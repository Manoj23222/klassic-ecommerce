"use client";

import { useState } from "react";

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
    setLoading(false);

    if (res.ok) {
      alert("Review added successfully");
      setComment("");
      window.location.reload();
    } else {
      alert(data.error || "Review failed");
    }
  };

  return (
    <form onSubmit={submitReview} className="mt-4 border rounded p-4 bg-gray-50">
      <h3 className="text-base font-bold mb-3">Rate & Review</h3>

      <input
        className="w-full border p-3 rounded mb-3 text-sm"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        className="w-full border p-3 rounded mb-3 text-sm"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
        <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
        <option value={3}>⭐⭐⭐ 3 Stars</option>
        <option value={2}>⭐⭐ 2 Stars</option>
        <option value={1}>⭐ 1 Star</option>
      </select>

      <textarea
        className="w-full border p-3 rounded mb-3 text-sm"
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded font-semibold text-sm"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}