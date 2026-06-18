"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    badge: "01",
    icon: "📊",
    items: [
      { name: "Command Center", href: "/admin" },
      { name: "Reports", href: "/admin/reports" },
    ],
  },
  {
    title: "Seller Management",
    badge: "02",
    icon: "🏪",
    items: [
      { name: "All Sellers", href: "/admin/sellers" },
      { name: "Seller KYC", href: "/admin/sellers" },
      { name: "Seller Payouts", href: "/admin/seller-payouts" },
      { name: "Withdraw Requests", href: "/admin/withdraw-requests" },
      { name: "Seller Performance", href: "/admin/reports/sellers" },
    ],
  },
  {
    title: "Catalog Engine",
    badge: "03",
    icon: "🧠",
    items: [
      { name: "Categories", href: "/admin/categories" },
      { name: "Attribute Rules", href: "/admin/attribute-rules" },
      { name: "Brands Master", href: "/admin/brands" },
      { name: "Inventory", href: "/admin/inventory" },
    ],
  },
  {
    title: "Product Moderation",
    badge: "04",
    icon: "📦",
    items: [
      { name: "All Products", href: "/admin/products" },
      { name: "Pending Approval", href: "/admin/products/pending" },
      { name: "Approved Products", href: "/admin/products/approved" },
      { name: "Rejected Products", href: "/admin/products/rejected" },
      { name: "Reviews Moderation", href: "/admin/reviews" },
    ],
  },
  {
    title: "Financials",
    badge: "05",
    icon: "💰",
    items: [
      { name: "Revenue", href: "/admin/reports" },
      { name: "Payouts", href: "/admin/seller-payouts" },
      { name: "Withdraw Requests", href: "/admin/withdraw-requests" },
      { name: "Refunds", href: "/admin/refunds" },
      { name: "Transactions", href: "/admin/transactions" },
    ],
  },
  {
    title: "Orders & Shipping",
    badge: "06",
    icon: "🚚",
    items: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Delivered Orders", href: "/admin/orders/delivered" },
      { name: "Returns", href: "/admin/orders/returns" },
      { name: "Refunds", href: "/admin/refunds" },
      { name: "Shipping Config", href: "/admin/settings/shipping" },
    ],
  },
  {
    title: "Customers & Disputes",
    badge: "07",
    icon: "👥",
    items: [
      { name: "Customers", href: "/admin/customers" },
      { name: "Customer Reviews", href: "/admin/reviews" },
      { name: "Disputes", href: "/admin/disputes" },
      { name: "Support Tickets", href: "/admin/support" },
    ],
  },
  {
    title: "Marketing Control",
    badge: "08",
    icon: "📣",
    items: [
      { name: "Banners", href: "/admin/banners" },
      { name: "Coupons", href: "/admin/coupons" },
      { name: "Flash Sales", href: "/admin/flash-sales" },
      { name: "Notifications", href: "/admin/notifications" },
      { name: "Homepage Sections", href: "/admin/homepage" },
    ],
  },
  {
    title: "Staff & RBAC",
    badge: "09",
    icon: "🔐",
    items: [
      { name: "Admins", href: "/admin/admins" },
      { name: "Roles & Permissions", href: "/admin/settings/roles" },
      { name: "Security", href: "/admin/settings/security" },
      { name: "Website Settings", href: "/admin/settings" },
    ],
  },
  
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[290px] shrink-0 overflow-hidden border-r border-white/10 bg-[#050816] text-white lg:sticky lg:top-0 lg:block">
      <div className="relative flex h-full flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.13),transparent_35%)]" />

        <div className="relative border-b border-white/10 p-6">
          <Link href="/admin" className="block">
            <h1 className="text-4xl font-black tracking-tight">
              Klassic
            </h1>
          </Link>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              Super Admin
            </p>

            <p className="mt-2 text-sm font-bold text-white/70">
              Luxury Command Center
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-bold text-white/50">
                System Online
              </span>
            </div>
          </div>
        </div>

        <nav className="relative flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {menus.map((section) => {
            const sectionActive = section.items.some(
              (item) =>
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
            );

            return (
              <div
                key={section.title}
                className={`rounded-[1.5rem] border p-2 transition ${
                  sectionActive
                    ? "border-cyan-300/20 bg-white/[0.07]"
                    : "border-transparent"
                }`}
              >
                <div className="mb-2 flex items-center gap-3 px-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-base">
                    {section.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                      {section.title}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black text-white/50">
                    {section.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/admin" &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={`${section.title}-${item.name}-${item.href}`}
                        href={item.href}
                        className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${
                          active
                            ? "bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.12)]"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{item.name}</span>

                        {active ? (
                          <span className="h-2 w-2 rounded-full bg-black" />
                        ) : (
                          <span className="text-white/20 transition group-hover:text-white/60">
                            →
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="relative mt-auto border-t border-white/10 p-4">
          <div className="rounded-3xl bg-white/[0.06] p-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              Klassic Admin
            </p>
            <p className="mt-1 text-sm font-bold text-white/70">
              Marketplace OS v1
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}