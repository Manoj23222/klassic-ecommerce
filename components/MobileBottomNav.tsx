"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid2x2,
  Heart,
  Package,
  ShoppingCart,
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-5">
          <NavItem
            href="/"
            icon={<Home size={17} />}
            label="Home"
          />

          <NavItem
            href="/grocery"
            icon={<Grid2x2 size={17} />}
            label="Category"
          />

          <NavItem
            href="/wishlist"
            icon={<Heart size={17} />}
            label="Wishlist"
          />

          <NavItem
            href="/my-orders"
            icon={<Package size={17} />}
            label="Orders"
          />

          <NavItem
            href="/cart"
            icon={<ShoppingCart size={17} />}
            label="Cart"
          />
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();

  const active =
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center py-1.5"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-500"
        }`}
      >
        {icon}
      </div>

      <span
        className={`mt-1 text-[9px] font-bold ${
          active
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}