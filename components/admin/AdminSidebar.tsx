"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    items: [
      { name: "Overview", href: "/admin" },
    ],
  },

  {
    title: "Users",
    items: [
      { name: "Customers", href: "/admin/customers" },
      { name: "Sellers", href: "/admin/sellers" },
      { name: "Admins", href: "/admin/admins" },
    ],
  },

  {
    title: "Products",
    items: [
      { name: "All Products", href: "/admin/products" },
      { name: "Pending Approval", href: "/admin/products/pending" },
      { name: "Rejected Products", href: "/admin/products/rejected" },
      { name: "Categories", href: "/admin/categories" },
      { name: "Brands", href: "/admin/brands" },
      { name: "Reviews", href: "/admin/reviews" },
    ],
  },

  {
    title: "Orders",
    items: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Pending", href: "/admin/orders/pending" },
      { name: "Processing", href: "/admin/orders/processing" },
      { name: "Delivered", href: "/admin/orders/delivered" },
      { name: "Returns", href: "/admin/returns" },
      { name: "Refunds", href: "/admin/refunds" },
    ],
  },

  {
    title: "Seller Management",
    items: [
      { name: "Seller Requests", href: "/admin/sellers" },
      { name: "Verification", href: "/admin/seller-verification" },
      { name: "Documents", href: "/admin/seller-documents" },
      { name: "Payouts", href: "/admin/seller-payouts" },
    ],
  },

  {
    title: "Finance",
    items: [
      { name: "Revenue", href: "/admin/reports" },
      { name: "Commissions", href: "/admin/commissions" },
      { name: "Withdraw Requests", href: "/admin/withdraws" },
      { name: "Settlements", href: "/admin/settlements" },
      { name: "Transactions", href: "/admin/transactions" },
    ],
  },

  {
    title: "Marketing",
    items: [
      { name: "Banners", href: "/admin/banners" },
      { name: "Homepage Sections", href: "/admin/homepage" },
      { name: "Coupons", href: "/admin/coupons" },
      { name: "Flash Sales", href: "/admin/flash-sales" },
      { name: "Notifications", href: "/admin/notifications" },
    ],
  },

  {
    title: "Reports",
    items: [
      { name: "Sales Reports", href: "/admin/reports/sales" },
      { name: "Customer Reports", href: "/admin/reports/customers" },
      { name: "Seller Reports", href: "/admin/reports/sellers" },
      { name: "Product Reports", href: "/admin/reports/products" },
    ],
  },

  {
  title: "AI Center",
  items: [
    { name: "AI Product Description", href: "/admin/ai-center/description" },
    { name: "AI SEO Generator", href: "/admin/ai-center/seo" },
    { name: "AI Product Title", href: "/admin/ai-center/title" },
    { name: "AI Sales Prediction", href: "/admin/ai-center/sales-prediction" },
    { name: "AI Trending Products", href: "/admin/ai-center/trending" },
  ],
},

  {
    title: "Settings",
    items: [
      { name: "Website Settings", href: "/admin/settings" },
      { name: "Payment Gateway", href: "/admin/settings/payment" },
      { name: "SMTP Email", href: "/admin/settings/email" },
      { name: "Security", href: "/admin/settings/security" },
      { name: "Roles & Permissions", href: "/admin/settings/roles" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
<aside className="w-[280px] h-screen sticky top-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-y-auto">      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-extrabold">
          Klassic
        </h1>

        <p className="text-blue-300 text-sm mt-1">
          Admin Control Center
        </p>
      </div>

      <div className="p-4 space-y-6">
        {menus.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-3">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-white/10 text-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}