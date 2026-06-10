"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
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
  const allProducts = [mainProduct, ...products.slice(0, 2)];
  const [selectedIds, setSelectedIds] = useState<number[]>(
    allProducts.map((p) => p.id)
  );

  const selectedProducts = useMemo(
    () => allProducts.filter((p) => selectedIds.includes(p.id)),
    [selectedIds, allProducts]
  );

  const total = selectedProducts.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const toggleProduct = (id: number) => {
    if (id === mainProduct.id) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addSelectedToCart = () => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItems = selectedProducts.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      quantity: 1,
    }));

    localStorage.setItem("cart", JSON.stringify([...oldCart, ...newItems]));
    alert("Selected products added to cart");
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4">
        Frequently Bought Together
      </h2>

      <div className="grid gap-3">
        {allProducts.map((item, index) => (
          <div key={item.id}>
            <label className="flex items-center gap-3 border rounded-xl p-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                disabled={item.id === mainProduct.id}
                onChange={() => toggleProduct(item.id)}
              />

              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 md:w-16 md:h-16 object-contain bg-gray-100 rounded"
              />

              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base line-clamp-2">
                  {item.name}
                </p>
                <p className="text-green-700 font-bold text-sm md:text-base">
                  ₹{Number(item.price).toFixed(2)}
                </p>
              </div>
            </label>

            {index < allProducts.length - 1 && (
              <div className="text-center text-lg md:text-xl font-bold text-gray-400">
                +
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-base md:text-lg font-bold">
          Total: ₹{total.toFixed(2)}
        </p>

        <button
          onClick={addSelectedToCart}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold text-sm md:text-base"
        >
          Add Selected To Cart
        </button>
      </div>
    </div>
  );
}