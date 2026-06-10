"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FloatingCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce(
        (sum: number, item: any) => sum + Number(item.quantity || 1),
        0
      );
      setCount(total);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-24 right-5 z-50 bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl md:bottom-8 hover:bg-green-700"
    >
      🛒
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">
        {count}
      </span>
    </Link>
  );
}