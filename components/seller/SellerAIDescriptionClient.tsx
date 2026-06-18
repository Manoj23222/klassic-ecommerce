"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerAIDescriptionClient() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");

  function generate() {
    const output = `${productName} is a premium quality product designed for modern customers. It offers ${features}. This product is suitable for daily use, gifting, and marketplace buyers looking for trusted value.`;

    setResult(output);
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">AI Product Description</h1>
        <p className="text-gray-500">
          Generate marketplace-ready product description.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <Input label="Product Name" value={productName} setValue={setProductName} />
          <Textarea label="Key Features" value={features} setValue={setFeatures} />

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold">Tone</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option>Professional</option>
              <option>Luxury</option>
              <option>Amazon Style</option>
              <option>Flipkart Style</option>
            </select>
          </label>

          <button
            onClick={generate}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Generate Description
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Generated Output</h2>

          <div className="min-h-72 rounded-2xl border bg-gray-50 p-4 text-sm leading-7">
            {result || "Generated description will appear here."}
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}