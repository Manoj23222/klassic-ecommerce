"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    title: "Dashboard",
    links: [{ name: "Dashboard", href: "/seller" }],
  },
  {
    title: "Products",
    links: [
      { name: "All Products", href: "/seller/products" },
      { name: "Add Product", href: "/seller/products/add" },
      { name: "Pending Approval", href: "/seller/products?status=Pending Approval" },
      { name: "Draft Products", href: "/seller/products?status=Draft" },
      { name: "Out of Stock", href: "/seller/products?stock=out" },
      { name: "Product Reviews", href: "/seller/reviews" },
    ],
  },
  {
    title: "Orders",
    links: [
      { name: "All Orders", href: "/seller/orders" },
      { name: "New Orders", href: "/seller/orders?status=Pending" },
      { name: "Processing Orders", href: "/seller/orders?status=Processing" },
      { name: "Shipped Orders", href: "/seller/orders?status=Shipped" },
      { name: "Delivered Orders", href: "/seller/orders?status=Delivered" },
      { name: "Cancelled Orders", href: "/seller/orders?status=Cancelled" },
      { name: "Returns & Refunds", href: "/seller/returns" },
    ],
  },
  {
    title: "Inventory",
    links: [
      { name: "Stock Management", href: "/seller/inventory" },
      { name: "Low Stock Alert", href: "/seller/inventory/low-stock" },
      { name: "Inventory History", href: "/seller/inventory/history" },
    ],
  },
  {
    title: "Coupons & Offers",
    links: [
      { name: "Create Coupon", href: "/seller/coupons/create" },
      { name: "Active Coupons", href: "/seller/coupons" },
      { name: "Flash Sale", href: "/seller/flash-sale" },
      { name: "Discount Campaigns", href: "/seller/campaigns" },
    ],
  },
  {
    title: "Earnings",
    links: [
      { name: "Total Sales", href: "/seller/earnings" },
      { name: "Settlement History", href: "/seller/settlements" },
      { name: "Withdraw Request", href: "/seller/withdraw" },
      { name: "Transaction History", href: "/seller/transactions" },
    ],
  },
  {
    title: "Store Management",
    links: [
      { name: "Store Profile", href: "/seller/store" },
      { name: "Store Banner", href: "/seller/store/banner" },
      { name: "Store Logo", href: "/seller/store/logo" },
      { name: "Store Settings", href: "/seller/store/settings" },
    ],
  },
  {
    title: "Account Settings",
    links: [
      { name: "Profile", href: "/seller/account" },
      { name: "Bank Details", href: "/seller/account/bank" },
      { name: "GST Details", href: "/seller/account/gst" },
      { name: "Security", href: "/seller/account/security" },
    ],
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 bg-white border-r min-h-screen p-4">
      <h2 className="text-2xl font-extrabold mb-5">Klassic Seller</h2>

      <div className="space-y-5">
        {menu.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
              {group.title}
            </h3>

            <div className="space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href.split("?")[0];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
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