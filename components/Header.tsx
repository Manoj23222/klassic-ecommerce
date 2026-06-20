"use client";

import { useEffect, useState } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Home,
  Grid3X3,
  User,
  Box,
  Heart,
  Bell,
  Store,
  ShieldCheck,
  LogOut,
  ShoppingCart,
  HelpCircle,
  CreditCard,
  ChevronRight,
  LayoutDashboard,
  Menu,
  MapPin,
  PlayCircle,
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
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserType | null>(null);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSeller = localStorage.getItem("seller");
    const savedCart = localStorage.getItem("cart");

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

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartCount(
          Array.isArray(cart)
            ? cart.reduce(
                (sum: number, item: any) => sum + Number(item.quantity || 1),
                0
              )
            : 0
        );
      } catch {
        setCartCount(0);
      }
    }
  }, []);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}

    localStorage.removeItem("user");
    localStorage.removeItem("seller");
    toast.success("Logged out successfully");

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 500);
  }

  const displayName = user?.name || seller?.store_name || seller?.name || "";
  const isAdmin = user?.role === "admin";
  const isSeller = seller?.status === "Approved";

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0b5c45] text-white shadow-md md:bg-slate-950">
        <div className="mx-auto max-w-7xl px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 md:hidden"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="text-xl font-black md:text-4xl">
              Klassic
            </Link>

            <div className="hidden flex-1 md:block">
              <HeaderSearch />
            </div>

            <div className="ml-auto hidden font-bold md:block">🇮🇳 EN</div>

            <DesktopAccount
              accountOpen={accountOpen}
              setAccountOpen={setAccountOpen}
              displayName={displayName}
              isAdmin={isAdmin}
              isSeller={isSeller}
              cartCount={cartCount}
              logout={logout}
            />

            <Link href="/my-orders" className="hidden text-sm md:block">
              <p className="text-gray-300">Returns</p>
              <p className="font-bold">& Orders</p>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-xl bg-white/10 px-2 py-2 text-sm font-black md:bg-transparent md:text-lg"
            >
              <ShoppingCart size={21} />
              <span className="hidden sm:inline">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="mt-2 md:hidden">
            <HeaderSearch />
          </div>

          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-black md:hidden">
            <MobileTopPill href="/" text="🏠 Home" />
            <MobileTopPill href="/grocery" text="🛍 Grocery" />
            <MobileTopPill href="/category/Fashion" text="👕 Fashion" />
            <MobileTopPill href="/category/Electronics" text="📱 Mobiles" />
            <MobileTopPill href="/become-seller" text="🏪 Seller" />
          </div>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-white px-4 py-4 text-black md:hidden">
            <div className="mb-3 rounded-2xl bg-slate-100 p-3">
              <p className="text-xs text-gray-500">Welcome</p>
              <p className="font-black">{displayName || "Guest User"}</p>
            </div>

            <div className="grid gap-1">
              <MobileLink href="/account" icon={<User size={18} />} text="My Account" />
              <MobileLink href="/my-orders" icon={<Box size={18} />} text="My Orders" />
              <MobileLink href="/wishlist" icon={<Heart size={18} />} text="Wishlist" />
              <MobileLink href="/notifications" icon={<Bell size={18} />} text="Notifications" />
              <MobileLink href="/help-center" icon={<HelpCircle size={18} />} text="Help Center" />
              <MobileLink href="/seller/dashboard" icon={<Store size={18} />} text="Seller Hub" />

              {isAdmin && (
                <MobileLink href="/admin" icon={<ShieldCheck size={18} />} text="Admin Panel" />
              )}

              {displayName ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 font-bold text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <>
                  <MobileLink href="/login" icon={<ShieldCheck size={18} />} text="Login" />
                  <MobileLink href="/register" icon={<User size={18} />} text="Register" />
                </>
              )}
            </div>
          </div>
        )}

        <div className="hidden bg-slate-800 text-white md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-2 text-sm font-semibold">
            <Link href="/#products" className="hover:text-yellow-300">☰ All</Link>
            <Link href="/grocery" className="hover:text-yellow-300">Grocery</Link>
            <Link href="/become-seller" className="hover:text-yellow-300">Become a Seller</Link>
            <Link href="/#products" className="hover:text-yellow-300">Bestsellers</Link>
            <Link href="/#products" className="hover:text-yellow-300">Today&apos;s Deals</Link>
            <Link href="/category/Electronics" className="hover:text-yellow-300">Electronics</Link>
            <Link href="/category/Fashion" className="hover:text-yellow-300">Fashion</Link>
            <Link href="/category/Home%20%26%20Kitchen" className="hover:text-yellow-300">Home & Kitchen</Link>
            <Link href="/category/Sports" className="hover:text-yellow-300">Sports</Link>
            <Link href="/help-center" className="hover:text-yellow-300">Customer Service</Link>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-2 py-1 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden">
        <div className="grid grid-cols-5 text-[11px] font-bold text-gray-600">
          <BottomLink href="/" icon={<Home size={22} />} text="Home" />
          <BottomLink href="/#products" icon={<PlayCircle size={22} />} text="Play" />
          <BottomLink href="/grocery" icon={<Grid3X3 size={22} />} text="Categories" />
          <BottomLink href="/account" icon={<User size={22} />} text="Account" />
          <BottomLink
            href="/cart"
            icon={
              <span className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            }
            text="Cart"
          />
        </div>
      </nav>
    </>
  );
}

function DesktopAccount({
  accountOpen,
  setAccountOpen,
  displayName,
  isAdmin,
  isSeller,
  cartCount,
  logout,
}: any) {
  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setAccountOpen(!accountOpen)}
        className="rounded-2xl border border-transparent px-4 py-2 text-left text-sm transition hover:border-blue-400 hover:bg-slate-900"
      >
        <p className="text-gray-300">
          {displayName ? `Hello, ${displayName}` : "Hello, Sign in"}
        </p>
        <p className="font-black">Account & Lists {accountOpen ? "▲" : "▼"}</p>
      </button>

      {accountOpen && (
        <div className="absolute right-0 mt-2 w-[330px] overflow-hidden rounded-[1.6rem] bg-[#f8f9fa] text-black shadow-2xl ring-1 ring-gray-200">
          <div className="bg-slate-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-black">
                {(displayName || "K").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Welcome to Klassic</p>
                <h2 className="truncate text-lg font-black">
                  {displayName || "Guest User"}
                </h2>
              </div>
            </div>
          </div>

          {(isAdmin || isSeller) && (
            <div className="mx-3 mt-3 flex gap-2">
              {isAdmin && (
                <Link href="/admin" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-3 py-2.5 text-xs font-black text-white">
                  <LayoutDashboard size={15} />
                  Admin
                </Link>
              )}
              {isSeller && (
                <Link href="/seller/dashboard" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-black text-black shadow-sm ring-1 ring-gray-200">
                  <Store size={15} />
                  Seller
                </Link>
              )}
            </div>
          )}

          <div className="mx-3 mt-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
            <CompactDropLink href="/account" icon={<User size={17} />} text="My Profile" />
            <CompactDropLink href="/my-orders" icon={<Box size={17} />} text="My Orders" />
            <CompactDropLink href="/wishlist" icon={<Heart size={17} />} text="Wishlist" />
            <CompactDropLink href="/notifications" icon={<Bell size={17} />} text="Notifications" />
            <CompactDropLink href="/help-center" icon={<HelpCircle size={17} />} text="Help Center" />
            <div className="my-1 border-t border-gray-100" />
            <CompactDropLink href="/cart" icon={<ShoppingCart size={17} />} text={`Cart (${cartCount})`} />
            <CompactDropLink href="/checkout" icon={<CreditCard size={17} />} text="Checkout" />
          </div>

          <div className="p-3 text-center">
            {displayName ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout Securely
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="rounded-full bg-black px-4 py-2.5 text-center text-xs font-black text-white">
                  Login
                </Link>
                <Link href="/register" className="rounded-full border bg-white px-4 py-2.5 text-center text-xs font-black">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileTopPill({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-black">
      {text}
    </Link>
  );
}

function BottomLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-0.5 py-1">
      <span className="text-blue-600">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}

function CompactDropLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link href={href} className="group flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 group-hover:text-black">{icon}</span>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-black">
          {text}
        </span>
      </div>
      <ChevronRight size={15} className="text-gray-300 group-hover:text-black" />
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
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2 font-semibold hover:bg-gray-100">
      <span className="text-blue-700">{icon}</span>
      {text}
    </Link>
  );
}