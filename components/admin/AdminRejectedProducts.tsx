"use client";

import { useEffect, useState } from "react";

export default function AdminRejectedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/products?status=Rejected")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white">
          <h1 className="text-3xl font-black">Rejected Products</h1>
          <p className="mt-2 text-sm text-gray-300">
            Products rejected by admin with reason.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="rounded-3xl bg-white p-4 shadow-sm">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="h-48 w-full rounded-2xl object-contain"
              />

              <h3 className="mt-3 line-clamp-2 font-black">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>

              <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
                {product.reject_reason || "No reason added"}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm md:col-span-3">
              No rejected products found
            </div>
          )}
        </div>
      </div>
    </main>
  );
}