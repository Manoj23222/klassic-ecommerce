"use client";

import { useState } from "react";

export default function AISEOPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<any>(null);

  async function generate() {
    const res = await fetch("/api/ai/seo", {
      method: "POST",
      body: JSON.stringify({ name, category }),
    });
    setResult(await res.json());
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow">
        <h1 className="text-3xl font-black">AI SEO Generator</h1>

        <input
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl border p-3"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={generate}
          className="mt-4 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white"
        >
          Generate SEO
        </button>

        {result?.success && (
          <div className="mt-6 space-y-4 rounded-xl bg-gray-50 p-5">
            <p><b>SEO Title:</b> {result.seoTitle}</p>
            <p><b>SEO Description:</b> {result.seoDescription}</p>
            <p><b>Keywords:</b> {result.keywords}</p>
            <p><b>Slug:</b> {result.slug}</p>
          </div>
        )}
      </div>
    </main>
  );
}