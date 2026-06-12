"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function RecentlyViewed({ product }: { product: Product }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const oldItems: Product[] = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    const filtered = oldItems.filter((item) => item.id !== product.id);
    const updated = [product, ...filtered].slice(0, 4);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    setItems(filtered.slice(0, 4));
  }, [product]);

  if (items.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="border rounded-xl p-4 hover:shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-contain"
            />

            <h3 className="font-bold mt-3">{item.name}</h3>
            <p className="text-green-700 font-bold">₹{item.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}