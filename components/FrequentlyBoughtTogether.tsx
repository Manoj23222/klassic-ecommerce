"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function FrequentlyBoughtTogether({
  mainProduct,
  products,
}: {
  mainProduct: Product;
  products: Product[];
}) {
  const bundleProducts = useMemo(
    () => [mainProduct, ...products.slice(0, 3)].filter(Boolean),
    [mainProduct, products]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
    bundleProducts.map((p) => p.id)
  );

  const selectedProducts = bundleProducts.filter((p) =>
    selectedIds.includes(p.id)
  );

  const total = selectedProducts.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  function toggleProduct(id: string) {
    if (id === mainProduct.id) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function addBundle() {
    toast.success("Selected bundle added to cart");
  }

  if (bundleProducts.length <= 1) return null;

  return (
    <section className="mt-5 rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-black">
        Frequently Bought Together
      </h2>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {bundleProducts.map((item, index) => (
            <div key={item.id} className="flex shrink-0 items-center gap-3">
              <div className="w-36 rounded-xl border bg-white p-2 md:w-44">
                <div className="h-28 w-full rounded-lg bg-gray-50 md:h-36">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <label className="mt-2 flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    disabled={item.id === mainProduct.id}
                    onChange={() => toggleProduct(item.id)}
                    className="mt-1"
                  />

                  <span className="line-clamp-2 font-bold">
                    {item.name}
                  </span>
                </label>

                <p className="mt-2 text-sm font-black text-green-700">
                  ₹{Number(item.price || 0).toLocaleString()}
                </p>
              </div>

              {index < bundleProducts.length - 1 && (
                <span className="text-3xl font-black text-gray-400">
                  +
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm font-bold text-gray-500">
            Total price
          </p>

          <p className="mt-1 text-3xl font-black">
            ₹{total.toLocaleString()}
          </p>

          <p className="mt-2 text-xs font-semibold text-gray-500">
            {selectedProducts.length} items selected
          </p>

          <button
            onClick={addBundle}
            className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-sm font-black text-white"
          >
            Add selected items
          </button>
        </div>
      </div>
    </section>
  );
}