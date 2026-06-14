"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  PlusCircle,
  Clock,
  ShoppingBag,
  RotateCcw,
  Wallet,
  Store,
  Settings,
} from "lucide-react";

const menuGroups = [
  {
    title: "Dashboard",
    links: [
      { name: "Dashboard", href: "/seller", icon: <LayoutDashboard size={18} /> },
      { name: "Earnings", href: "/seller/earnings", icon: <Wallet size={18} /> },
    ],
  },
  {
    title: "Products",
    links: [
      { name: "All Products", href: "/seller/products", icon: <Package size={18} /> },
      { name: "Add Product", href: "/seller/products/add", icon: <PlusCircle size={18} /> },
      { name: "Pending Approval", href: "/seller/products?status=Pending Approval", icon: <Clock size={18} /> },
    ],
  },
  {
    title: "Orders & Store",
    links: [
      { name: "Orders", href: "/seller/orders", icon: <ShoppingBag size={18} /> },
      { name: "Returns", href: "/seller/returns", icon: <RotateCcw size={18} /> },
      { name: "Store Profile", href: "/seller/store/profile", icon: <Store size={18} /> },
      { name: "Settings", href: "/seller/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function SellerMobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
          >
            <Menu size={22} />
          </button>

          <Link href="/seller" className="font-extrabold text-lg">
            Klassic Seller
          </Link>

          <Link
            href="/seller/products/add"
            className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold"
          >
            + Add
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="w-[82%] max-w-sm h-full bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-extrabold">Klassic Seller</h2>
                <p className="text-sm text-gray-500">Seller Hub Menu</p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              {menuGroups.map((group) => (
                <div key={group.title} className="border rounded-2xl overflow-hidden">
                  <div className="bg-slate-950 text-white px-4 py-3 font-extrabold">
                    {group.title}
                  </div>

                  <div className="p-2 space-y-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 font-semibold text-gray-700"
                      >
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}