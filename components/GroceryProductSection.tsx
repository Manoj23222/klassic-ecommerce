"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string;
};

const groceryCategories = [
  { name: "All", icon: "🛒" },
  { name: "Fruits & Vegetables", icon: "🥦" },
  { name: "Atta Rice & Dal", icon: "🌾" },
  { name: "Masala & Spices", icon: "🧂" },
  { name: "Papad & Pickles", icon: "🌶️" },
  { name: "Oil & Ghee", icon: "🛢️" },
  { name: "Snacks & Namkeen", icon: "🍿" },
  { name: "Biscuits & Cookies", icon: "🍪" },
  { name: "Tea & Coffee", icon: "☕" },
  { name: "Milk & Dairy", icon: "🥛" },
  { name: "Bread & Bakery", icon: "🍞" },
  { name: "Cleaning & Household", icon: "🧼" },
  { name: "Personal Care", icon: "🪥" },
  { name: "Baby Care", icon: "👶" },
  { name: "Pet Food", icon: "🐕" },
  { name: "Frozen Food", icon: "❄️" },
];

export default function GroceryProductSection({
  products,
}: {
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">🛒 Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
        {groceryCategories.map((item) => (
          <button
            type="button"
            key={item.name}
            onClick={() => setActiveCategory(item.name)}
            className={`rounded-2xl shadow p-4 text-center transition ${
              activeCategory === item.name
                ? "bg-green-600 text-white"
                : "bg-white hover:shadow-xl"
            }`}
          >
            <div className="text-3xl">{item.icon}</div>
            <p className="font-bold mt-2 text-sm">{item.name}</p>
          </button>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">
        🛍️ {activeCategory === "All" ? "All Grocery Products" : activeCategory}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h3 className="text-2xl font-bold">No Products Found</h3>
          <p className="text-gray-500 mt-2">
            Add products in this category from admin panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const productId = item._id || item.id;
            if (!productId) return null;

            return (
              <Link
                key={productId}
                href={`/product/${productId}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden block"
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-56 w-full object-contain p-5 bg-white"
                  />

                  <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    Fresh
                  </span>
                </div>

                <div className="p-5">
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    {item.category || "Grocery"}
                  </span>

                  <h4 className="mt-3 font-bold text-lg">{item.name}</h4>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description || "Fresh grocery product"}
                  </p>

                  <p className="text-green-700 font-bold text-xl mt-2">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </p>

                  <p className="text-gray-600 font-semibold mt-1">
                    Stock: {item.stock ?? 0}
                  </p>

                  <button
                    type="button"
                    className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-bold"
                  >
                    View Product
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}