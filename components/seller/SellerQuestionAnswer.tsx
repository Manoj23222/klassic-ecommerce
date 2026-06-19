"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerQuestionAnswer({
  question,
}: {
  question: any;
}) {
  const [answer, setAnswer] = useState(question.answer || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(question.status || "Pending");

  async function submitAnswer() {
    if (!answer.trim()) {
      toast.error("Answer required");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/seller/questions/${question._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Answer failed");
      return;
    }

    toast.success("Answer saved");
    setStatus("Answered");
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex gap-4">
        <img
          src={question.product?.image || "/placeholder.png"}
          alt={question.product?.name || "Product"}
          className="h-20 w-20 rounded-2xl border object-contain"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-black">
                {question.product?.name || "Product"}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Asked by {question.customer_name}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                status === "Answered"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-black">Customer Question</p>
            <p className="mt-2 text-sm text-gray-700">
              {question.question}
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-black">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Write a helpful answer..."
              className="w-full rounded-2xl border p-3 text-sm outline-none focus:border-black"
            />

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="mt-3 rounded-full bg-black px-6 py-3 text-sm font-black text-white disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Answer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}