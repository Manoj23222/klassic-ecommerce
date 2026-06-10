"use client";

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

export default function ProductSearch({
  products,
}: {
  products: Product[];
}) {
  const filteredProducts = products;

  return (
    <section className="max-w-7xl mx-auto py-6">
      <p className="mb-5 font-semibold">
        Showing {filteredProducts.length} products
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden block"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-36 md:h-56 w-full object-contain p-3 bg-white"
            />

            <div className="p-3">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {item.category || "General"}
              </span>

              <h4 className="mt-2 font-bold text-sm md:text-lg line-clamp-2">
                {item.name}
              </h4>

              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>

              <p className="text-blue-700 font-bold text-base md:text-xl mt-2">
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