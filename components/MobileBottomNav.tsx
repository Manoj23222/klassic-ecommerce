"use client";

import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
      <div className="grid grid-cols-5 text-xs font-bold text-gray-700">
        <Link href="/" className="py-3 text-center">
          <div className="text-xl">🏠</div>
          Home
        </Link>

        <Link href="/grocery" className="py-3 text-center">
          <div className="text-xl">🛒</div>
          Grocery
        </Link>

        <Link href="/wishlist" className="py-3 text-center">
          <div className="text-xl">❤️</div>
          Wishlist
        </Link>

        <Link href="/my-orders" className="py-3 text-center">
          <div className="text-xl">📦</div>
          Orders
        </Link>

        <Link href="/cart" className="py-3 text-center">
          <div className="text-xl">🛍️</div>
          Cart
        </Link>
      </div>
    </nav>
  );
}