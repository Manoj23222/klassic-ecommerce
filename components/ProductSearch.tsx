"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Bookmark, Eye, ShoppingBag } from "lucide-react";

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
  featured?: boolean;
};

function getPrice(item: Product) {
  return Number(item.sale_price || item.salePrice || item.price || 0);
}

function getMrp(item: Product) {
  const price = getPrice(item);
  const base = Number(item.price || 0);
  if (base > price) return base;
  return Math.round(price * 1.18);
}

export default function ProductSearch({ products }: { products: Product[] }) {
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
        category: item.category || "General",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  }

  function saveProduct(item: Product) {
    const productId = String(item._id || item.id || "");
    if (!productId) return;

    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = saved.some((x: any) => String(x.id || x._id) === productId);

    if (exists) {
      toast("Already saved");
      return;
    }

    saved.push({
      id: productId,
      _id: productId,
      name: item.name,
      price: getPrice(item),
      image: item.image || "/placeholder.png",
      category: item.category || "General",
    });

    localStorage.setItem("wishlist", JSON.stringify(saved));
    toast.success("Saved");
  }

  return (
    <section className="mx-auto max-w-7xl py-3">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
            Klassic Collection
          </p>
          <h2 className="mt-1 text-lg font-black">
            Showing {products.length} products
          </h2>
        </div>

        <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-black text-gray-500 shadow-sm sm:inline-block">
          Premium Picks
        </span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <h3 className="text-2xl font-black">No Products Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Approved products will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
          {products.map((item) => {
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
className="group flex h-[285px] flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg sm:h-[330px]"              >
                <Link href={`/product/${productId}`} className="block">
                  <div className="relative flex h-[125px] items-center justify-center overflow-hidden bg-[#f7f5f1] p-2 sm:h-[145px]">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                    />

                    {off > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-white">
                        {off}% OFF
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="max-w-[90px] truncate rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-black text-gray-600">
                      {item.category || "General"}
                    </span>

                    <button
                      type="button"
                      onClick={() => saveProduct(item)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white text-gray-500"
                    >
                      <Bookmark size={12} />
                    </button>
                  </div>

                  <Link href={`/product/${productId}`}>
                    <h4 className="mt-1.5 line-clamp-2 h-8 text-[10px] font-black leading-4 text-gray-950 sm:text-xs">
                      {item.name}
                    </h4>
                  </Link>

                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-amber-500">
                    ★★★★★
                    <span className="text-gray-500">(4.5)</span>
                  </div>

                  <div className="mt-1.5 flex items-end gap-1">
                    <p className="text-sm font-black text-black sm:text-base">
                      ₹{price.toLocaleString("en-IN")}
                    </p>

                    {mrp > price && (
                      <p className="text-[9px] font-bold text-gray-400 line-through">
                        ₹{mrp.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[8px] font-black ${
                        stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stock > 0 ? "In Stock" : "Out"}
                    </span>

                    {stock > 0 && (
                      <span className="text-[8px] font-black text-gray-400">
                        {stock} left
                      </span>
                    )}
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2">
                    <button
                      type="button"
                      disabled={stock <= 0}
                      onClick={() => addToCart(item)}
                      className="flex items-center justify-center gap-1 rounded-lg bg-black py-1.5 text-[9px] font-black text-white disabled:bg-gray-300"
                    >
                      <ShoppingBag size={11} />
                      Add
                    </button>

                    <Link
                      href={`/product/${productId}`}
                      className="flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[9px] font-black"
                    >
                      <Eye size={11} />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}