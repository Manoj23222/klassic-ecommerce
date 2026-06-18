"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerAISalesPredictionClient() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [result, setResult] = useState<any>(null);

  function predict() {
    const priceNum = Number(price || 0);
    const stockNum = Number(stock || 0);

    let score = 60;

    if (priceNum > 0 && priceNum < 999) score += 15;
    if (stockNum > 10) score += 10;
    if (category) score += 5;

    score = Math.min(score, 95);

    setResult({
      score,
      demand: score >= 80 ? "High" : score >= 65 ? "Medium" : "Low",
      estimatedSales: Math.max(5, Math.round((score / 10) * 3)),
      suggestion:
        score >= 80
          ? "Product has strong selling potential."
          : "Improve price, images and SEO to increase sales.",
    });
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">AI Sales Prediction</h1>
        <p className="text-gray-500">Estimate demand and selling chance.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <Input label="Product Name" value={productName} setValue={setProductName} />
          <Input label="Category" value={category} setValue={setCategory} />
          <Input label="Selling Price" value={price} setValue={setPrice} type="number" />
          <Input label="Available Stock" value={stock} setValue={setStock} type="number" />

          <button
            onClick={predict}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Predict Sales
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Prediction Result</h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-black text-green-700">
                  Sales Score
                </p>
                <p className="mt-2 text-5xl font-black text-green-800">
                  {result.score}%
                </p>
              </div>

              <Info label="Demand" value={result.demand} />
              <Info label="Estimated Weekly Sales" value={`${result.estimatedSales} orders`} />
              <Info label="Suggestion" value={result.suggestion} />
            </div>
          ) : (
            <div className="rounded-2xl border bg-gray-50 p-6 text-center text-gray-500">
              Prediction result will appear here
            </div>
          )}
        </section>
      </div>
    </SellerCentralLayout>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="text-xs font-black uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}