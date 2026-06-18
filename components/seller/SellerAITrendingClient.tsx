"use client";

import { useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const demoTrending: Record<string, string[]> = {
  Electronics: [
    "Wireless Earbuds",
    "Smart Watch",
    "Fast Charger",
    "Bluetooth Speaker",
    "Power Bank",
  ],
  Fashion: [
    "Oversized T-Shirt",
    "Cargo Pants",
    "Sneakers",
    "Denim Jacket",
    "Sports Shoes",
  ],
  Home: [
    "LED Table Lamp",
    "Storage Organizer",
    "Wall Shelf",
    "Chair Cushion",
    "Kitchen Rack",
  ],
};

export default function SellerAITrendingClient() {
  const [category, setCategory] = useState("Electronics");
  const [items, setItems] = useState<string[]>([]);

  function findTrending() {
    setItems(demoTrending[category] || demoTrending.Electronics);
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">AI Trending Products</h1>
        <p className="text-gray-500">Find product ideas for your store.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
            </select>
          </label>

          <button
            onClick={findTrending}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white"
          >
            Find Trending Products
          </button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Trending Ideas</h2>

          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item} className="rounded-2xl border bg-gray-50 p-4 font-black">
                🔥 {item}
              </div>
            ))}

            {items.length === 0 && (
              <div className="rounded-2xl border bg-gray-50 p-6 text-center text-gray-500 md:col-span-2">
                Trending ideas will appear here
              </div>
            )}
          </div>
        </section>
      </div>
    </SellerCentralLayout>
  );
}