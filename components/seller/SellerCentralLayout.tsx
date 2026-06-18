"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const groups = [
  { name: "Dashboard", icon: "📊", href: "/seller/dashboard" },
  {
    name: "Catalog",
    icon: "📦",
    items: [
      { name: "My Products", href: "/seller/products" },
      { name: "Add Product", href: "/seller/products/add" },
      {
  name: "Bulk Upload",
  href: "/seller/products/bulk-upload",
},
    ],
  },
  {
    name: "Orders",
    icon: "🧾",
    badge: "12",
    items: [{ name: "All Orders", href: "/seller/orders" }],
  },
  { name: "Payments", icon: "💳", href: "/seller/payments" },
  { name: "Reports", icon: "📈", href: "/seller/reports" },
  { name: "Performance", icon: "⭐", href: "/seller/performance" },
  {
  name: "Badges",
  icon: "🏆",
  href: "/seller/badges",
},
{
  name: "Seller Level",
  icon: "👑",
  href: "/seller/level",
},
  {
  name: "AI Center",
  icon: "🤖",
  href: "/seller/ai",
},
{
  name: "Marketing",
  icon: "📢",
  items: [
    { name: "Marketing Center", href: "/seller/marketing" },
    { name: "Banners", href: "/seller/marketing/banners" },
    { name: "Coupons", href: "/seller/marketing/coupons" },
    { name: "Campaigns", href: "/seller/marketing/campaigns" },
    { name: "Store SEO", href: "/seller/marketing/seo" },
    { name: "Notifications", href: "/seller/marketing/notifications" },
    { name: "Social Tools", href: "/seller/marketing/social" },
  ],
},
  { name: "Settings", icon: "⚙️", href: "/seller/settings" },
];

export default function SellerCentralLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <header className="sticky top-0 z-50 border-b bg-slate-950 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="rounded-xl bg-slate-900 px-3 py-2 font-black lg:hidden">
            ☰
          </button>

          <Link href="/seller/dashboard" className="text-lg font-black tracking-wide">
            KLASSIC SELLER CENTRAL
          </Link>

          <input
            placeholder="Search Order/SKU..."
            className="hidden w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-blue-500 md:block"
          />

          <button className="ml-auto rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold">
            🔔 3
          </button>

          <button className="hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold sm:block">
            User Hub ▾
          </button>
        </div>
      </header>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-[80] bg-black/50 lg:hidden" />
      )}

      <aside className={`fixed left-0 top-0 z-[90] h-full w-[285px] bg-white p-4 shadow-2xl transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-950 p-4 text-white">
          <div>
            <p className="text-xs font-bold text-blue-200">KLASSIC</p>
            <p className="font-black">Seller Central</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-xl font-black">×</button>
        </div>

        <SidebarMenu pathname={pathname} onClose={() => setOpen(false)} />
      </aside>

      <div className="grid lg:grid-cols-[270px_1fr]">
        <aside className="hidden min-h-[calc(100vh-57px)] border-r bg-white p-4 lg:block">
          <SidebarMenu pathname={pathname} />
        </aside>

        <section className="p-4 md:p-6">{children}</section>
      </div>
    </main>
  );
}

function SidebarMenu({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <nav className="space-y-2">
        {groups.map((group) => (
          <MenuGroup key={group.name} group={group} pathname={pathname} onClose={onClose} />
        ))}
      </nav>

      <div className="mt-8 border-t pt-4">
        <Link href="/seller/logout" onClick={onClose} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50">
          🚪 Logout
        </Link>
      </div>
    </>
  );
}

function MenuGroup({ group, pathname, onClose }: { group: any; pathname: string; onClose?: () => void }) {
  const hasItems = Array.isArray(group.items);
  const active = pathname === group.href || group.items?.some((x: any) => pathname === x.href.split("?")[0]);
  const [open, setOpen] = useState(active || group.name === "Catalog");

  if (!hasItems) {
    return (
      <Link href={group.href} onClick={onClose} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>
        <span>{group.icon}</span>
        {group.name}
      </Link>
    );
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
        <span className="flex items-center gap-3">
          <span>{group.icon}</span>
          {group.name}
        </span>
        <span>{open ? "⌃" : "⌄"}</span>
      </button>

      {open && (
        <div className="ml-6 mt-2 space-y-1 border-l pl-3">
          {group.items.map((item: any) => (
            <Link key={item.href} href={item.href} onClick={onClose} className={`block rounded-xl px-3 py-2 text-sm font-bold ${pathname === item.href.split("?")[0] ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}