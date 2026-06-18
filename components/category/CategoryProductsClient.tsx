"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DynamicFilters from "@/components/category/DynamicFilters";

export default function CategoryProductsClient({
  products,
}: {
  products: any[];
}) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return Object.entries(selectedFilters).every(
        ([fieldKey, values]) => {
          if (!values.length) return true;

          const value =
            product.attributes?.[fieldKey];

          return values.includes(
            String(value)
          );
        }
      );
    });
  }, [products, selectedFilters]);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <DynamicFilters
        products={products}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <div>
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-black">
            Showing {filteredProducts.length} Products
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-lg"
            >
              <img
                src={
                  product.image ||
                  "/placeholder.png"
                }
                alt={product.name}
                className="h-44 w-full object-contain"
              />

              <h3 className="mt-3 line-clamp-2 text-sm font-bold">
                {product.name}
              </h3>

              <p className="mt-2 text-lg font-black text-green-700">
                ₹
                {Number(
                  product.sale_price ||
                    product.salePrice ||
                    product.price ||
                    0
                ).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}