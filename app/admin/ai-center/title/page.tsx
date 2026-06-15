"use client";

import { useState } from "react";

export default function AITitlePage() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [features, setFeatures] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  async function generate() {
    const res = await fetch("/api/ai/title", {
      method: "POST",
      body: JSON.stringify({ name, brand, features }),
    });
    const data = await res.json();
    setTitles(data.titles || []);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow">
        <h1 className="text-3xl font-black">AI Product Title Generator</h1>

        <input className="mt-6 w-full rounded-xl border p-3" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="mt-4 w-full rounded-xl border p-3" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <textarea className="mt-4 h-28 w-full rounded-xl border p-3" placeholder="Features" value={features} onChange={(e) => setFeatures(e.target.value)} />

        <button onClick={generate} className="mt-4 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white">
          Generate Titles
        </button>

        <div className="mt-6 space-y-3">
          {titles.map((t, i) => (
            <div key={i} className="rounded-xl border bg-gray-50 p-4 font-semibold">
              {t}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}