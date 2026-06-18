"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerAITitleClient() {
  const [brand, setBrand] = useState("");
  const [productType, setProductType] = useState("");
  const [features, setFeatures] = useState("");

  const [titles, setTitles] = useState<string[]>([]);

  function generateTitles() {
    const generated = [
      `${brand} ${productType} - ${features}`,
      `${brand} Premium ${productType} for Everyday Use`,
      `${brand} ${productType} | Best Quality & Performance`,
      `${brand} ${productType} with ${features}`,
      `${brand} Original ${productType} - Marketplace Bestseller`,
    ];

    setTitles(generated);
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">
          AI Product Title Generator
        </h1>

        <p className="text-gray-500">
          Generate Amazon & Flipkart style product titles.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">
              Brand
            </span>

            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold">
              Product Type
            </span>

            <input
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold">
              Key Features
            </span>

            <textarea
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </label>

          <button
            onClick={generateTitles}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Generate Titles
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">
            Generated Titles
          </h2>

          <div className="space-y-3">
            {titles.map((title, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-gray-50 p-4"
              >
                <p className="font-semibold">{title}</p>
              </div>
            ))}

            {titles.length === 0 && (
              <div className="rounded-2xl border bg-gray-50 p-6 text-center text-gray-500">
                Generated titles will appear here
              </div>
            )}
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}