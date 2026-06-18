"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerProductsClient() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/products?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black">My Products</h1>
          <p className="text-gray-500">Manage catalog, stock and approval status.</p>
        </div>

        <Link
          href="/seller/products/add"
          className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          + Add Product
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3">Variants</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "/placeholder.png"}
                        className="h-14 w-14 rounded-xl object-contain"
                        alt=""
                      />
                      <div>
                        <p className="line-clamp-1 font-black">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-bold">{p.sku || "-"}</td>
                  <td className="p-3 font-black">
                    ₹{Number(p.sale_price || p.salePrice || p.price || 0).toLocaleString()}
                  </td>
                  <td className="p-3">{p.stock || 0}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{p.variants?.length || 0}</td>
                  <td className="p-3">
                    <Link
                      href={`/seller/products/edit/${p._id}`}
                      className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center font-bold text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerCentralLayout>
  );
}