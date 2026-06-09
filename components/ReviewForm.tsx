"use client";

import { useState } from "react";

export default function ReviewForm({ productId }: { productId: number }) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        customer_name: customerName,
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Review submitted successfully");
      window.location.reload();
    } else {
      alert("Review failed");
    }
  };

  return (
    <form onSubmit={submitReview} className="bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

      <input
        className="w-full border p-3 rounded-lg mb-3"
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      <select
        className="w-full border p-3 rounded-lg mb-3"
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
        className="w-full border p-3 rounded-lg mb-3"
        placeholder="Write your review..."
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
        Submit Review
      </button>
    </form>
  );
}