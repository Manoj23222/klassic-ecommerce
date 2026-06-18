"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerPendingProductsClient() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(
      localStorage.getItem("seller") || "{}"
    );

    const sellerId =
      seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(
      `/api/seller/products?seller_id=${sellerId}`
    )
      .then((res) => res.json())
      .then((data) => {
        const pending =
          (data.products || []).filter(
            (p: any) =>
              p.status ===
              "Pending Approval"
          );

        setProducts(pending);
      });
  }, []);

  return (
    <SellerCentralLayout>
      <h1 className="mb-6 text-3xl font-black">
        Pending Approval
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="rounded-3xl bg-white p-4 shadow-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full rounded-2xl object-cover"
            />

            <h3 className="mt-3 font-black">
              {product.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              SKU: {product.sku}
            </p>

            <div className="mt-3 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700 inline-block">
              Pending Approval
            </div>
          </div>
        ))}
      </div>
    </SellerCentralLayout>
  );
}