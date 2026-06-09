"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  featured?: number | boolean;
};

export default function ProductSearch({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Home & Kitchen",
    "Fashion",
    "Electronics",
    "Books",
    "Sports",
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => (p.category || "General") === category);

  return (
    <section className="max-w-7xl mx-auto py-6">
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={
              category === cat
                ? "bg-blue-700 text-white px-5 py-2 rounded-xl font-bold"
                : "bg-white text-gray-800 px-5 py-2 rounded-xl font-bold shadow hover:bg-blue-600 hover:text-white"
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mb-5 font-semibold">
        Showing {filteredProducts.length} products
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden block"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-56 w-full object-contain p-5 bg-white"
            />

            <div className="p-5">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {item.category || "General"}
              </span>

              <h4 className="mt-3 font-bold text-lg">{item.name}</h4>

              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>

              <p className="text-blue-700 font-bold text-xl mt-2">
                ₹{Number(item.price).toFixed(2)}
              </p>

              <p className="text-green-600 font-semibold mt-1">
                Stock: {item.stock}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}