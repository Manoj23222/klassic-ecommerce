"use client";

import { useMemo, useState } from "react";
import DynamicFilters from "./DynamicFilters";
import Link from "next/link";

export default function FilteredProducts({
  products,
}: {
  products: any[];
}) {
  const [filters, setFilters] = useState<any>({});

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const attrs = product.attributes || {};

      for (const [key, selected] of Object.entries(filters)) {
        const values = selected as string[];

        if (!values.length) continue;

        if (key === "brand") {
          if (!values.includes(product.brand)) {
            return false;
          }
        } else {
          if (
            !values.includes(
              String(attrs[key] || "")
            )
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [products, filters]);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside>
        <DynamicFilters
          products={products}
          filters={filters}
          setFilters={setFilters}
        />
      </aside>

      <section>
        <div className="mb-4 text-sm font-bold">
          Products Found: {filteredProducts.length}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="rounded-2xl border bg-white p-3"
            >
              <img
                src={
                  product.image ||
                  "/placeholder.png"
                }
                alt={product.name}
                className="h-44 w-full object-contain"
              />

              <h3 className="mt-2 line-clamp-2 text-sm font-bold">
                {product.name}
              </h3>

              <p className="mt-1 text-lg font-black text-green-700">
                ₹
                {Number(
                  product.sale_price ||
                    product.salePrice ||
                    product.price
                ).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}