"use client";

import { useState } from "react";

export default function AIDescriptionPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    features: "",
  });
  const [result, setResult] = useState("");

  async function generate() {
    const res = await fetch("/api/ai/description", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.description || "");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow">
        <h1 className="text-3xl font-black">AI Product Description Generator</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {["name", "category", "brand", "price"].map((key) => (
            <input
              key={key}
              placeholder={key.toUpperCase()}
              className="rounded-xl border p-3"
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
        </div>

        <textarea
          placeholder="Product features / material / size / use"
          className="mt-4 h-32 w-full rounded-xl border p-3"
          value={form.features}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
        />

        <button
          onClick={generate}
          className="mt-4 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white"
        >
          Generate Description
        </button>

        {result && (
          <pre className="mt-6 whitespace-pre-wrap rounded-xl bg-gray-900 p-5 text-white">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}