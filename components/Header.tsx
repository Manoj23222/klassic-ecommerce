import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";
import UserStatus from "@/components/UserStatus";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow">
      {/* Top Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-4xl font-extrabold text-white">
            Klassic
          </Link>

          {/* Location */}
          <div className="hidden md:block text-sm">
            <p className="text-gray-300">Delivering to</p>
            <p className="font-bold">Jaipur 302002</p>
          </div>

          {/* Search */}
          <div className="flex-1">
            <HeaderSearch />
          </div>

          {/* Language */}
          <div className="hidden md:block font-bold">
            🇮🇳 EN
          </div>

          {/* Account */}
          <Link href="/account" className="text-sm">
            <p className="text-gray-300">Hello, Sign in</p>
            <p className="font-bold">Account & Lists</p>
          </Link>

          {/* Orders */}
          <Link href="/my-orders" className="text-sm">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="font-bold text-lg hover:text-yellow-300"
          >
            🛒 Cart
          </Link>

          <UserStatus />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          <Link href="/categories">☰ All</Link>
          <Link href="/#products">Fresh</Link>
          <Link href="/seller">Sell</Link>
          <Link href="/bestsellers">Bestsellers</Link>
          <Link href="/deals">Today's Deals</Link>
          <Link href="/mobiles">Mobiles</Link>
          <Link href="/prime">Prime</Link>
          <Link href="/new">New Releases</Link>
          <Link href="/support">Customer Service</Link>
          <Link href="/electronics">Electronics</Link>
          <Link href="/fashion">Fashion</Link>
          <Link href="/home-kitchen">Home & Kitchen</Link>
          <Link href="/computers">Computers</Link>
        </div>
      </div>
    </header>
  );
}