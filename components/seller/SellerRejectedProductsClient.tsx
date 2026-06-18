"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerRejectedProductsClient() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/products?seller_id=${sellerId}&status=Rejected`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Rejected Products</h1>
        <p className="text-gray-500">Fix issues and resubmit for approval.</p>
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
              Reason: {product.reject_reason || "Admin rejected this product"}
            </div>

            <Link
              href={`/seller/products/edit/${product._id}`}
              className="mt-4 inline-block rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
            >
              Fix & Resubmit
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm md:col-span-3">
            No rejected products found
          </div>
        )}
      </div>
    </SellerCentralLayout>
  );
}