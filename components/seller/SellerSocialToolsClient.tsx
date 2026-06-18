"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerSocialToolsClient() {
  const [productName, setProductName] = useState("");
  const [offer, setOffer] = useState("");
  const [caption, setCaption] = useState("");

  function generateCaption() {
    setCaption(
      `🔥 New arrival: ${productName}\n${offer ? `Special Offer: ${offer}\n` : ""}Shop now on Klassic and grab the best deal today!\n\n#Klassic #OnlineShopping #BestDeals`
    );
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Social Media Tools</h1>
        <p className="text-gray-500">Create share-ready product captions.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <Input label="Product Name" value={productName} setValue={setProductName} />
          <Input label="Offer / Discount" value={offer} setValue={setOffer} />

          <button
            onClick={generateCaption}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Generate Caption
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Generated Caption</h2>

          <textarea
            rows={10}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-2xl border bg-gray-50 p-4 text-sm leading-7"
            placeholder="Caption will appear here"
          />
        </section>
      </div>
    </SellerCentralLayout>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </label>
  );
}