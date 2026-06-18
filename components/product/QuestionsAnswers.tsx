"use client";

export default function QuestionsAnswers() {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Questions & Answers</h2>
        <button className="rounded-xl border px-4 py-2 text-sm font-black text-blue-600">
          Ask Question
        </button>
      </div>

      <div className="space-y-3">
        <QA
          q="Is this product returnable?"
          a="Return depends on seller policy and product category."
        />
        <QA
          q="Is Cash on Delivery available?"
          a="Yes, COD is available on eligible locations."
        />
      </div>
    </section>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border p-3 text-sm">
      <p>
        <b>Q:</b> {q}
      </p>
      <p className="mt-2 text-gray-600">
        <b>A:</b> {a}
      </p>
    </div>
  );
}