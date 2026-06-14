"use client";

import { useEffect, useState } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Store,
  ShieldCheck,
  LogOut,
  ShoppingCart,
} from "lucide-react";

type UserType = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};
export default function Header() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [user, setUser] = useState<UserType | null>(null);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSeller = localStorage.getItem("seller");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (savedSeller) {
      try {
        setSeller(JSON.parse(savedSeller));
      } catch {
        localStorage.removeItem("seller");
      }
    }
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch {}

    localStorage.removeItem("user");
    localStorage.removeItem("seller");

    toast.success("Logged out successfully");

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 500);
  };

  const displayName =
    user?.name ||
    seller?.store_name ||
    seller?.name ||
    "";
      return (
    <header className="sticky top-0 z-50 shadow">
      <div className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-3xl"
          >
            ☰
          </button>

          <Link href="/" className="text-3xl md:text-4xl font-extrabold">
            Klassic
          </Link>

          <div className="hidden md:block flex-1">
            <HeaderSearch />
          </div>

          <div className="hidden md:block font-bold">🇮🇳 EN</div>

          <div className="hidden md:block relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="text-sm text-left px-3 py-2 rounded-xl hover:bg-slate-800 border border-transparent hover:border-blue-500"
            >
              <p className="text-gray-300">
                {displayName ? `Hello, ${displayName}` : "Hello, Sign in"}
              </p>
              <p className="font-bold">
                Account & Lists {accountOpen ? "▲" : "▼"}
              </p>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-3xl shadow-2xl border z-50 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl border border-blue-300">
                      {(displayName || "K").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm text-gray-300">Welcome to</p>
                      <p className="text-xl font-extrabold">
                        {displayName || "Klassic Account"}
                      </p>

                      {user?.role === "admin" && (
                        <p className="text-xs text-blue-300 font-bold mt-1">
                          Admin Access
                        </p>
                      )}

                      {seller?.status === "Approved" && (
                        <p className="text-xs text-green-300 font-bold mt-1">
                          Verified Seller
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <DropLink href="/account" icon={<User size={18} />} text="My Profile" />
                  <DropLink href="/my-orders" icon={<Package size={18} />} text="My Orders" />
                  <DropLink href="/wishlist" icon={<Heart size={18} />} text="Wishlist" />
                  <DropLink href="/account" icon={<MapPin size={18} />} text="Saved Addresses" />
                  <DropLink href="/help-center" icon={<Bell size={18} />} text="Notifications" />

                  {seller?.status === "Approved" && (
                    <>
                      <div className="my-2 border-t" />
                      <DropLink href="/seller/dashboard" icon={<Store size={18} />} text="Seller Hub" />
                    </>
                  )}

                  {user?.role === "admin" && (
                    <>
                      <div className="my-2 border-t" />
                      <DropLink href="/admin" icon={<ShieldCheck size={18} />} text="Admin Control Panel" />
                    </>
                  )}

                  <div className="my-2 border-t" />

                  {displayName ? (
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-600 font-bold"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <LogOut size={18} />
                      </div>
                      Logout
                    </button>
                  ) : (
                    <>
                      <DropLink href="/login" icon={<ShieldCheck size={18} />} text="Login" />
                      <DropLink href="/register" icon={<User size={18} />} text="Register" />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/my-orders" className="hidden md:block text-sm">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          <Link
            href="/cart"
            className="ml-auto md:ml-0 font-bold text-lg hover:text-yellow-300 flex items-center gap-2"
          >
            <ShoppingCart size={22} /> Cart
          </Link>
        </div>

        <div className="md:hidden px-4 pb-3">
          <HeaderSearch />
        </div>

        {open && (
          <div className="md:hidden bg-white text-black px-4 py-4 space-y-2">
            <MobileLink href="/account" icon={<User size={18} />} text="My Account" />
            <MobileLink href="/my-orders" icon={<Package size={18} />} text="My Orders" />
            <MobileLink href="/wishlist" icon={<Heart size={18} />} text="Wishlist" />

            {seller?.status === "Approved" && (
              <MobileLink href="/seller/dashboard" icon={<Store size={18} />} text="Seller Hub" />
            )}

            {user?.role === "admin" && (
              <MobileLink href="/admin" icon={<ShieldCheck size={18} />} text="Admin Panel" />
            )}

            {displayName ? (
              <button
                onClick={logout}
                className="flex items-center gap-3 py-2 text-red-600 font-bold"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <MobileLink href="/login" icon={<ShieldCheck size={18} />} text="Login" />
                <MobileLink href="/register" icon={<User size={18} />} text="Register" />
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-semibold">
          <Link href="/#products" className="hover:text-yellow-300">☰ All</Link>
          <Link href="/grocery" className="hover:text-yellow-300">Grocery</Link>
          <Link href="/grocery" className="hover:text-yellow-300">Fresh Grocery</Link>
          <Link href="/become-seller" className="hover:text-yellow-300">Become a Seller</Link>
          <Link href="/#products" className="hover:text-yellow-300">Bestsellers</Link>
          <Link href="/#products" className="hover:text-yellow-300">Today's Deals</Link>
          <Link href="/category/Electronics" className="hover:text-yellow-300">Electronics</Link>
          <Link href="/category/Fashion" className="hover:text-yellow-300">Fashion</Link>
          <Link href="/category/Home%20%26%20Kitchen" className="hover:text-yellow-300">Home & Kitchen</Link>
          <Link href="/category/Sports" className="hover:text-yellow-300">Sports</Link>
          <Link href="/help-center" className="hover:text-yellow-300">Customer Service</Link>
        </div>
      </div>
    </header>
  );
}

function DropLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
        {icon}
      </div>

      <span className="font-semibold text-gray-800">{text}</span>
    </Link>
  );
}

function MobileLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 py-2 font-semibold">
      <span className="text-blue-700">{icon}</span>
      {text}
    </Link>
  );
}