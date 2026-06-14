"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, Package, ShoppingBag } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/seller")) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t shadow-2xl pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 text-[10px] font-bold text-gray-700">
        <NavItem href="/" icon={<Home size={18} />} label="Home" />
        <NavItem href="/grocery" icon={<ShoppingCart size={18} />} label="Grocery" />
        <NavItem href="/wishlist" icon={<Heart size={18} />} label="Wishlist" />
        <NavItem href="/my-orders" icon={<Package size={18} />} label="Orders" />
        <NavItem href="/cart" icon={<ShoppingBag size={18} />} label="Cart" />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 py-2 text-gray-700">
      <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}