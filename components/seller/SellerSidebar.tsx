"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    title: "Dashboard",
    icon: "🏠",
    links: [
      { name: "Dashboard", href: "/seller" },
      { name: "Analytics", href: "/seller/earnings" },
      { name: "Performance", href: "/seller/inventory" },
    ],
  },
  {
    title: "Products",
    icon: "📦",
    links: [
      { name: "All Products", href: "/seller/products" },
      { name: "Add Product", href: "/seller/products/add" },
      { name: "Pending Approval", href: "/seller/products?status=Pending Approval" },
      { name: "Draft Products", href: "/seller/products?status=Draft" },
      { name: "Low Stock", href: "/seller/products?stock=out" },
      { name: "Reviews", href: "/seller/products/reviews" },
    ],
  },
  {
    title: "Orders & Store",
    icon: "🛒",
    links: [
      { name: "All Orders", href: "/seller/orders" },
      { name: "New Orders", href: "/seller/orders?status=Pending" },
      { name: "Returns", href: "/seller/returns" },
      { name: "Earnings", href: "/seller/earnings" },
      { name: "Bank Details", href: "/seller/account/bank" },
      { name: "Store Profile", href: "/seller/store/profile" },
      { name: "Settings", href: "/seller/settings" },
    ],
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r min-h-screen p-4 overflow-y-auto">
      <h2 className="text-2xl font-extrabold mb-6">
        Klassic Seller
      </h2>

      <div className="space-y-4">
        {menu.map((group) => (
          <div
            key={group.title}
            className="border rounded-2xl overflow-hidden bg-gray-50"
          >
            <div className="bg-slate-950 text-white px-4 py-3 font-extrabold flex items-center gap-2">
              <span>{group.icon}</span>
              {group.title}
            </div>

            <div className="p-2 space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href.split("?")[0];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}