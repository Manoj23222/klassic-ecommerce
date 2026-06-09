import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";
import UserStatus from "@/components/UserStatus";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-4xl font-extrabold">
            Klassic
          </Link>

          <div className="hidden md:block text-sm">
            <p className="text-gray-300">Delivering to</p>
            <p className="font-bold">Jaipur 302002</p>
          </div>

          <div className="flex-1">
            <HeaderSearch />
          </div>

          <div className="hidden md:block font-bold">🇮🇳 EN</div>

          <div className="relative group">
            <button className="text-sm text-left">
              <p className="text-gray-300">Hello, Sign in</p>
              <p className="font-bold">Account & Lists ▼</p>
            </button>

            <div className="absolute hidden group-hover:block right-0 mt-2 w-56 bg-white text-black rounded-xl shadow-xl border z-50 overflow-hidden">
              <Link href="/account" className="block px-4 py-3 hover:bg-gray-100">
                👤 My Account
              </Link>

              <Link href="/my-orders" className="block px-4 py-3 hover:bg-gray-100">
                📦 My Orders
              </Link>

              <Link href="/wishlist" className="block px-4 py-3 hover:bg-gray-100">
                ❤️ Wishlist
              </Link>

              <Link href="/admin" className="block px-4 py-3 hover:bg-gray-100">
                ⚙️ Admin Panel
              </Link>

              <Link href="/login" className="block px-4 py-3 hover:bg-gray-100">
                🔐 Login
              </Link>

              <Link href="/register" className="block px-4 py-3 hover:bg-gray-100">
                📝 Register
              </Link>

              <Link href="/logout" className="block px-4 py-3 hover:bg-red-50 text-red-600">
                🚪 Logout
              </Link>
            </div>
          </div>

          <Link href="/my-orders" className="text-sm">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          <Link href="/cart" className="font-bold text-lg hover:text-yellow-300">
            🛒 Cart
          </Link>

          <UserStatus />
        </div>
      </div>

      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-semibold">
          <Link href="/#products" className="hover:text-yellow-300">
            ☰ All
          </Link>
          <Link href="/category/General" className="hover:text-yellow-300">
            Fresh
          </Link>
          <Link href="/admin/product" className="hover:text-yellow-300">
            Sell
          </Link>
          <Link href="/#products" className="hover:text-yellow-300">
            Bestsellers
          </Link>
          <Link href="/#products" className="hover:text-yellow-300">
            Today's Deals
          </Link>
          <Link href="/category/Electronics" className="hover:text-yellow-300">
            Electronics
          </Link>
          <Link href="/category/Fashion" className="hover:text-yellow-300">
            Fashion
          </Link>
          <Link href="/category/Home%20%26%20Kitchen" className="hover:text-yellow-300">
            Home & Kitchen
          </Link>
          <Link href="/category/Sports" className="hover:text-yellow-300">
            Sports
          </Link>
          <Link href="/#products" className="hover:text-yellow-300">
            Customer Service
          </Link>
        </div>
      </div>
    </header>
  );
}