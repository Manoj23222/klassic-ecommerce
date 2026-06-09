"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    setWishlist(
      JSON.parse(localStorage.getItem("wishlist") || "[]")
    );
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          ❤️ My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold">
              Wishlist is Empty
            </h2>

            <Link
              href="/"
              className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="bg-white rounded-2xl shadow p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-contain"
                />

                <h3 className="font-bold mt-4">
                  {item.name}
                </h3>

                <p className="text-green-600 font-bold mt-2">
                  ₹{item.price}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}