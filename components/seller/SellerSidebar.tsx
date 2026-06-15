"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    title: "Dashboard",
    icon: "🏠",
    links: [
      { name: "Overview", href: "/seller" },
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
      { name: "Low Stock", href: "/seller/products?stock=low" },
      { name: "Reviews", href: "/seller/products/reviews" },
    ],
  },
  {
    title: "Orders",
    icon: "🚚",
    links: [
      { name: "All Orders", href: "/seller/orders" },
      { name: "New Orders", href: "/seller/orders?status=Pending" },
      { name: "Processing", href: "/seller/orders?status=Processing" },
      { name: "Delivered", href: "/seller/orders?status=Delivered" },
      { name: "Returns", href: "/seller/returns" },
    ],
  },
  {
    title: "Finance",
    icon: "💰",
    links: [
      { name: "Earnings", href: "/seller/earnings" },
      { name: "Withdraw", href: "/seller/earnings/withdraw" },
      { name: "Bank Details", href: "/seller/account/bank" },
      { name: "Transactions", href: "/seller/earnings/transactions" },
    ],
  },
  {
    title: "AI Growth",
    icon: "🤖",
    links: [
      { name: "AI Product Title", href: "/seller/products/add" },
      { name: "AI Description", href: "/seller/products/add" },
      { name: "AI SEO", href: "/seller/products/add" },
      { name: "AI Sales Prediction", href: "/seller/analytics/sales" },
    ],
  },
  {
    title: "Store",
    icon: "🏪",
    links: [
      { name: "Store Profile", href: "/seller/store/profile" },
      { name: "Store Settings", href: "/seller/settings" },
    ],
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <>
<aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:block h-screen w-[280px] overflow-y-auto border-r border-white/10 bg-gradient-to-b from-[#020617] via-[#07111f] to-[#0f172a] text-white"><div className="border-b border-white/10 px-6 py-7">
         <h2 className="text-4xl font-black tracking-tight">
            Klassic</h2>
          <p className="mt-2 text-sm font-bold text-orange-300">
            Seller Command Center
          </p>
        </div>

        <nav className="space-y-7 px-4 py-6">
          {menu.map((group) => (
            <div key={group.title}>
<div className="mb-3 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">   
               <span>{group.icon}</span>
                <span>{group.title}</span>
              </div>

              <div className="space-y-1">
                {group.links.map((link) => {
                  const cleanHref = link.href.split("?")[0];
                  const active =
                    pathname === cleanHref ||
                    (cleanHref !== "/seller" && pathname.startsWith(cleanHref));

                  return (
                    <Link
                     key={`${group.title}-${link.name}-${link.href}`}
                      href={link.href}
className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-bold transition-all duration-200 ${
                          active
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && <span className="text-xs">●</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-2 py-2 shadow-2xl lg:hidden">
        <div className="grid grid-cols-5 gap-1 text-center">
          <MobileLink href="/seller" icon="🏠" label="Home" pathname={pathname} />
          <MobileLink href="/seller/products" icon="📦" label="Products" pathname={pathname} />
          <MobileLink href="/seller/products/add" icon="➕" label="Add" pathname={pathname} />
          <MobileLink href="/seller/orders" icon="🚚" label="Orders" pathname={pathname} />
          <MobileLink href="/seller/earnings" icon="💰" label="Money" pathname={pathname} />
        </div>
      </div>
    </>
  );
}

function MobileLink({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href || (href !== "/seller" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`rounded-xl px-1 py-2 text-[11px] font-black ${
        active ? "bg-orange-500 text-white" : "text-slate-700"
      }`}
    >
      <div className="text-lg leading-none">{icon}</div>
      <div className="mt-1">{label}</div>
    </Link>
  );
}