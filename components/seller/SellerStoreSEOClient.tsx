"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerStoreSEOClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Store SEO</h1>
        <p className="text-gray-500">Optimize your seller store for search.</p>
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <Input label="SEO Title" value={title} setValue={setTitle} />
        <Textarea label="SEO Description" value={description} setValue={setDescription} />
        <Textarea label="SEO Keywords" value={keywords} setValue={setKeywords} />

        <button className="mt-5 rounded-xl bg-blue-600 px-8 py-3 font-black text-white">
          Save SEO
        </button>
      </section>
    </SellerCentralLayout>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border p-3" />
    </label>
  );
}

function Textarea({ label, value, setValue }: any) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      <textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border p-3" />
    </label>
  );
}