"use client";

import { useState } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="md:hidden text-3xl">
            ☰
          </button>

          <Link href="/" className="text-3xl md:text-4xl font-extrabold">
            Klassic
          </Link>

          <div className="hidden md:block flex-1">
            <HeaderSearch />
          </div>

          <div className="hidden md:block font-bold">🇮🇳 EN</div>

          <div className="hidden md:block relative group">
            <button className="text-sm text-left px-3 py-2 rounded-xl hover:bg-slate-800">
              <p className="text-gray-300">Hello, Sign in</p>
              <p className="font-bold">Account & Lists ▼</p>
            </button>

            <div className="absolute hidden group-hover:block right-0 mt-3 w-72 bg-white text-black rounded-2xl shadow-2xl border z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4">
                <p className="text-sm text-gray-300">Welcome to</p>
                <p className="text-xl font-bold">Klassic Account</p>
              </div>

              <div className="p-2">
                <Link href="/account" className="block px-4 py-3 rounded-xl hover:bg-blue-50">
                  👤 My Account
                </Link>
                <Link href="/my-orders" className="block px-4 py-3 rounded-xl hover:bg-green-50">
                  📦 My Orders
                </Link>
                <Link href="/wishlist" className="block px-4 py-3 rounded-xl hover:bg-pink-50">
                  ❤️ Wishlist
                </Link>

                <div className="my-2 border-t" />

                <Link href="/login" className="block px-4 py-3 rounded-xl hover:bg-gray-100">
                  🔐 Login
                </Link>
                <Link href="/register" className="block px-4 py-3 rounded-xl hover:bg-gray-100">
                  📝 Register
                </Link>
              </div>
            </div>
          </div>

          <Link href="/my-orders" className="hidden md:block text-sm">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          <Link href="/cart" className="ml-auto md:ml-0 font-bold text-lg hover:text-yellow-300">
            🛒 Cart
          </Link>
        </div>

        <div className="md:hidden px-4 pb-3">
          <HeaderSearch />
        </div>

        {open && (
          <div className="md:hidden bg-white text-black px-4 py-4 space-y-2">
            <Link href="/account" className="block py-2">
              👤 My Account
            </Link>
            <Link href="/my-orders" className="block py-2">
              📦 My Orders
            </Link>
            <Link href="/wishlist" className="block py-2">
              ❤️ Wishlist
            </Link>
            <Link href="/login" className="block py-2">
              🔐 Login
            </Link>
            <Link href="/register" className="block py-2">
              📝 Register
            </Link>
          </div>
        )}
      </div>

      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-semibold">
          <Link href="/#products" className="hover:text-yellow-300">☰ All</Link>
          <Link href="/grocery" className="hover:text-yellow-300">Grocery</Link>
          <Link href="/grocery" className="hover:text-yellow-300">Fresh Grocery</Link>
          <Link href="/become-seller" className="hover:text-yellow-300">Become a Seller</Link>
          <Link href="/#products" className="hover:text-yellow-300">Bestsellers</Link>
          <Link href="/#products" className="hover:text-yellow-300">Today's Deals</Link>
          <Link href="/category/Electronics" className="hover:text-yellow-300">Electronics</Link>
          <Link href="/category/Fashion" className="hover:text-yellow-300">Fashion</Link>
          <Link href="/category/Home%20%26%20Kitchen" className="hover:text-yellow-300">Home & Kitchen</Link>
          <Link href="/category/Sports" className="hover:text-yellow-300">Sports</Link>
          <Link href="/help-center" className="hover:text-yellow-300">Customer Service</Link>
        </div>
      </div>
    </header>
  );
}