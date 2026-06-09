import HeaderSearch from "@/components/HeaderSearch";
import HeaderCategories from "@/components/HeaderCategories";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow">
      {/* Top Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-4xl font-extrabold">
            Klassic
          </Link>

          <div className="flex-1">
            <HeaderSearch />
          </div>

          <div className="hidden md:block font-bold">🇮🇳 EN</div>

          {/* Account Dropdown */}
          <div className="relative group">
            <button className="text-sm text-left px-3 py-2 rounded-xl hover:bg-slate-800 transition">
              <p className="text-gray-300">Hello, Sign in</p>
              <p className="font-bold">Account & Lists ▼</p>
            </button>

            <div className="absolute hidden group-hover:block right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4">
                <p className="text-sm text-gray-300">Welcome to</p>
                <p className="text-xl font-bold">Klassic Account</p>
              </div>

              <div className="p-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50"
                >
                  👤 My Account
                </Link>

                <Link
                  href="/my-orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50"
                >
                  📦 My Orders
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50"
                >
                  ❤️ Wishlist
                </Link>

                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-yellow-50"
                >
                  ⚙️ Admin Panel
                </Link>

                <div className="my-2 border-t" />

                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
                >
                  🔐 Login
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
                >
                  📝 Register
                </Link>

                <Link
                  href="/logout"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-semibold"
                >
                  🚪 Logout
                </Link>
              </div>
            </div>
          </div>

          <Link href="/my-orders" className="text-sm">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          <Link
            href="/cart"
            className="font-bold text-lg hover:text-yellow-300"
          >
            🛒 Cart
          </Link>
        </div>
      </div>

      {/* Categories Bar */}
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

          {/* Dynamic Categories from DB */}
          <HeaderCategories />

          <Link href="/#products" className="hover:text-yellow-300">
            Customer Service
          </Link>
        </div>
      </div>
    </header>
  );
}