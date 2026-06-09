"use client";

import { useState } from "react";

export default function ReviewForm({ productId }: { productId: number }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, name, rating, comment }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Review added successfully");
      setName("");
      setRating(5);
      setComment("");
      window.location.reload();
    } else {
      alert("Review failed");
    }
  };

  return (
    <form onSubmit={submitReview} className="mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

      <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        className="w-full border p-3 rounded mb-3"
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
        className="w-full border p-3 rounded mb-3"
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}