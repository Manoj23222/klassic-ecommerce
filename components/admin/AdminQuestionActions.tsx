"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminQuestionActions({
  question,
}: {
  question: any;
}) {
  const router = useRouter();

  const [answer, setAnswer] = useState(question.answer || "");
  const [loading, setLoading] = useState(false);

  async function saveAnswer() {
    if (!answer.trim()) {
      toast.error("Answer required");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/questions/${question._id}`, {
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
      toast.error(data.error || "Failed to save answer");
      return;
    }

    toast.success("Answer saved");
    router.refresh();
  }

  async function deleteQuestion() {
    const ok = confirm("Delete this question?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/admin/questions/${question._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }

    toast.success("Question deleted");
    router.push("/admin/questions");
    router.refresh();
  }

  return (
    <div className="mt-5 rounded-2xl border p-4">
      <h3 className="text-lg font-black">Admin Answer Control</h3>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        placeholder="Write or edit seller/admin answer..."
        className="mt-3 w-full rounded-2xl border p-3 text-sm outline-none focus:border-black"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={saveAnswer}
          disabled={loading}
          className="rounded-full bg-black px-6 py-3 text-sm font-black text-white disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Answer"}
        </button>

        <button
          onClick={deleteQuestion}
          disabled={loading}
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white disabled:bg-gray-400"
        >
          Delete Question
        </button>
      </div>
    </div>
  );
}