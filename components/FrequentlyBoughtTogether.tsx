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
  const allProducts = useMemo(
    () => [mainProduct, ...products.slice(0, 2)],
    [mainProduct, products]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
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

  const toggleProduct = (id: string) => {
    if (id === mainProduct.id) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addSelectedToCart = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products");
      return;
    }

    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItems = selectedProducts.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      quantity: 1,
    }));

    localStorage.setItem("cart", JSON.stringify([...oldCart, ...newItems]));
    window.dispatchEvent(new Event("storage"));

    toast.success(`${selectedProducts.length} products added to cart`);
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-extrabold text-gray-900">
          Frequently Bought Together
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Save time by adding matching products together.
        </p>
      </div>

      <div className="grid gap-3">
        {allProducts.map((item, index) => (
          <div key={item.id}>
            <label
              className={`flex items-center gap-3 border rounded-2xl p-3 transition ${
                selectedIds.includes(item.id)
                  ? "border-blue-300 bg-blue-50"
                  : "bg-white hover:border-blue-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                disabled={item.id === mainProduct.id}
                onChange={() => toggleProduct(item.id)}
                className="w-5 h-5"
              />

              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 md:w-16 md:h-16 object-contain bg-gray-100 rounded-xl"
              />

              <div className="flex-1">
                <p className="font-bold text-sm md:text-base line-clamp-2 text-gray-900">
                  {item.name}
                </p>
                <p className="text-green-700 font-extrabold text-sm md:text-base">
                  ₹{Number(item.price).toFixed(2)}
                </p>

                {item.id === mainProduct.id && (
                  <span className="inline-block mt-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Main Product
                  </span>
                )}
              </div>
            </label>

            {index < allProducts.length - 1 && (
              <div className="text-center text-lg md:text-xl font-extrabold text-gray-400">
                +
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-bold">Combo Total</p>
          <p className="text-xl md:text-2xl font-extrabold text-gray-900">
            ₹{total.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={addSelectedToCart}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-extrabold text-sm md:text-base transition"
        >
          Add Selected To Cart
        </button>
      </div>
    </div>
  );
}