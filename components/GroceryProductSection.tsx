"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  stock?: number;
  image?: string;
  category?: string;
  brand?: string;
  unit?: string;
};

const groceryCategories = [
  { name: "All", icon: "🛒" },
  { name: "Fruits & Vegetables", icon: "🥦" },
  { name: "Atta Rice & Dal", icon: "🌾" },
  { name: "Masala & Spices", icon: "🌶️" },
  { name: "Papad & Pickles", icon: "🥒" },
  { name: "Oil & Ghee", icon: "🫙" },
  { name: "Snacks & Namkeen", icon: "🍿" },
  { name: "Biscuits & Cookies", icon: "🍪" },
  { name: "Tea & Coffee", icon: "☕" },
  { name: "Milk & Dairy", icon: "🥛" },
  { name: "Bread & Bakery", icon: "🍞" },
  { name: "Cleaning & Household", icon: "🧼" },
  { name: "Personal Care", icon: "🪥" },
  { name: "Baby Care", icon: "🍼" },
  { name: "Pet Food", icon: "🐕" },
  { name: "Frozen Food", icon: "❄️" },
];

function getPrice(item: Product) {
  return Number(item.sale_price || item.salePrice || item.price || 0);
}

function getMrp(item: Product) {
  const price = getPrice(item);
  const base = Number(item.price || 0);

  if (base > price) return base;

  return Math.round(price * 1.18);
}

export default function GroceryProductSection({
  products,
}: {
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const filteredProducts = useMemo(() => {
    let list =
      activeCategory === "All"
        ? [...products]
        : products.filter((p) => p.category === activeCategory);

    if (sort === "priceLow") {
      list = list.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sort === "priceHigh") {
      list = list.sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sort === "stock") {
      list = list.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    }

    return list;
  }, [products, activeCategory, sort]);

  function addToCart(item: Product) {
    const productId = String(item._id || item.id || "");
    if (!productId) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existsIndex = cart.findIndex(
      (x: any) => String(x.id || x._id) === productId
    );

    if (existsIndex >= 0) {
      cart[existsIndex].quantity = Number(cart[existsIndex].quantity || 1) + 1;
    } else {
      cart.push({
        id: productId,
        _id: productId,
        name: item.name,
        price: getPrice(item),
        image: item.image || "/placeholder.png",
        quantity: 1,
        category: item.category || "Grocery",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  }

  return (
    <section className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-700/60">
            Grocery Store
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Shop by Category
          </h2>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border bg-white px-4 py-2 text-xs font-black outline-none focus:border-green-700"
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price Low</option>
          <option value="priceHigh">Price High</option>
          <option value="stock">Stock</option>
        </select>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {groceryCategories.map((item) => (
          <button
            type="button"
            key={item.name}
            onClick={() => setActiveCategory(item.name)}
            className={`min-w-[92px] rounded-2xl px-3 py-3 text-center transition ${
              activeCategory === item.name
                ? "bg-green-700 text-white shadow-lg shadow-green-700/20"
                : "bg-white text-gray-800 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="text-2xl">{item.icon}</div>

            <p className="mt-2 line-clamp-2 text-[11px] font-black leading-4">
              {item.name}
            </p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">
          {activeCategory === "All" ? "All Grocery Products" : activeCategory}
        </h2>

        <p className="rounded-full bg-white px-4 py-2 text-xs font-black text-gray-500 shadow-sm">
          {filteredProducts.length} items
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🛒</div>
          <h3 className="mt-4 text-2xl font-black">No Products Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add products in this category from admin panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filteredProducts.map((item) => {
            const productId = String(item._id || item.id || "");
            if (!productId) return null;

            const price = getPrice(item);
            const mrp = getMrp(item);
            const off =
              mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

            const stock = Number(item.stock || 0);

            return (
              <div
                key={productId}
                className="group overflow-hidden rounded-[1.4rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/product/${productId}`} className="block">
                  <div className="relative aspect-square bg-[#f3f8ea] p-3">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-2 top-2 rounded-full bg-green-700 px-2 py-1 text-[10px] font-black text-white">
                      Fresh
                    </span>

                    {off > 0 && (
                      <span className="absolute right-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-black text-white">
                        {off}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="line-clamp-2 min-h-[38px] text-sm font-black leading-5">
                      {item.name}
                    </p>

                    <p className="mt-1 line-clamp-1 text-[11px] font-bold text-gray-500">
                      {item.brand || item.category || "Klassic Grocery"}
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <p className="text-base font-black">
                        ₹{price.toLocaleString("en-IN")}
                      </p>

                      {mrp > price && (
                        <p className="text-xs font-bold text-gray-400 line-through">
                          ₹{mrp.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-black ${
                          stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stock > 0 ? `${stock} left` : "Out of stock"}
                      </span>

                      <span className="text-xs font-black text-yellow-600">
                        4.5★
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-2 px-3 pb-3">
                  <button
                    type="button"
                    disabled={stock <= 0}
                    onClick={() => addToCart(item)}
                    className="rounded-full bg-green-700 py-2 text-[11px] font-black text-white disabled:bg-gray-300"
                  >
                    Add
                  </button>

                  <Link
                    href={`/product/${productId}`}
                    className="rounded-full border py-2 text-center text-[11px] font-black"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}