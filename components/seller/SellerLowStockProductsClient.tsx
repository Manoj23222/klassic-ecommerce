"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerLowStockProductsClient() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/products?seller_id=${sellerId}&stock=low`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Low Stock Alert</h1>
        <p className="text-gray-500">Products that need restocking soon.</p>
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

            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                Stock: {product.stock || 0}
              </span>

              <Link
                href={`/seller/products/edit/${product._id}`}
                className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
              >
                Update Stock
              </Link>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm md:col-span-3">
            No low stock products found
          </div>
        )}
      </div>
    </SellerCentralLayout>
  );
}