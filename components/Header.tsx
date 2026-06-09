import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";
import UserStatus from "@/components/UserStatus";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link
          href="/"
          className="text-3xl font-bold hover:text-yellow-300 transition"
        >
          Klassic
        </Link>

        <div className="flex-1">
          <HeaderSearch />
        </div>

        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/" className="hover:text-yellow-300">
            Home
          </Link>

          <Link href="/#products" className="hover:text-yellow-300">
            Products
          </Link>

          <Link href="/cart" className="hover:text-yellow-300">
            🛒 Cart
          </Link>

          <Link href="/wishlist" className="hover:text-pink-300">
            ❤️ Wishlist
          </Link>

          <Link href="/my-orders" className="hover:text-yellow-300">
            📦 My Orders
          </Link>
          <Link href="/account" className="hover:text-yellow-300">
  👤 Account
</Link>

          <UserStatus />
        </nav>
      </div>
    </header>
  );
}