"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerAISEOClient() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  function generateSEO() {
    setSeoTitle(`${productName} | Best ${category} Online at Klassic`);

    setSeoDescription(
      `Buy ${productName} online at Klassic. Premium quality ${category} with best price, fast delivery and trusted seller support.`
    );

    setKeywords(
      `${productName}, ${category}, buy ${productName}, best ${category}, online shopping, Klassic`
    );
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">AI SEO Generator</h1>
        <p className="text-gray-500">
          Generate SEO title, description and keywords.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">
              Product Name
            </span>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold">
              Category
            </span>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </label>

          <button
            onClick={generateSEO}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Generate SEO
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-black">
            SEO Result
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-black">
                SEO Title
              </p>

              <textarea
                value={seoTitle}
                readOnly
                rows={2}
                className="w-full rounded-xl border bg-gray-50 p-3"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-black">
                SEO Description
              </p>

              <textarea
                value={seoDescription}
                readOnly
                rows={4}
                className="w-full rounded-xl border bg-gray-50 p-3"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-black">
                SEO Keywords
              </p>

              <textarea
                value={keywords}
                readOnly
                rows={4}
                className="w-full rounded-xl border bg-gray-50 p-3"
              />
            </div>
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}