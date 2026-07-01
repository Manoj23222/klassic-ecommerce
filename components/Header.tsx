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
  Globe2,
  Languages,
  Trophy,
  Gift,
  Wallet,
  PackageCheck,
  TicketPercent,
  Sparkles,
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
  const [country, setCountry] = useState("India");
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSeller = localStorage.getItem("seller");
    const savedCart = localStorage.getItem("cart");
    const savedLang = localStorage.getItem("klassic_language");

    if (savedLang) setLanguage(savedLang);

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

    if (navigator.geolocation) {
      setCountry("India");
    }
  }, []);

  function changeLanguage(value: string) {
    setLanguage(value);
    localStorage.setItem("klassic_language", value);
    toast.success(`Language changed to ${value}`);
  }

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
      <header className="sticky top-0 z-50 bg-white text-[#111] shadow-sm">
        <div className="bg-gradient-to-r from-[#061f1a] via-[#0b5c45] to-[#101010] text-white">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 md:px-4">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 md:hidden"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="text-xl font-black tracking-tight md:text-3xl">
              Klassic
            </Link>

            <div className="hidden flex-1 md:block">
              <HeaderSearch />
            </div>

            <div className="ml-auto hidden items-center gap-3 md:flex">
              <TopMiniButton icon={<MapPin size={15} />} text={country} />
              <LanguageSelect language={language} changeLanguage={changeLanguage} />
              <Link href="/become-seller" className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-black text-black">
                <Store size={15} />
                Seller
              </Link>
              <Link href="/help-center" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-black text-white">
                <HelpCircle size={15} />
                Help
              </Link>
            </div>

            <DesktopAccount
              accountOpen={accountOpen}
              setAccountOpen={setAccountOpen}
              displayName={displayName}
              isAdmin={isAdmin}
              isSeller={isSeller}
              cartCount={cartCount}
              logout={logout}
            />

            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-xl bg-white/10 px-2 py-2 text-sm font-black md:text-base"
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

          <div className="px-3 pb-2 md:hidden">
            <HeaderSearch />
          </div>
        </div>

        <div className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 text-xs font-black text-gray-700 md:px-4">
            <MiniNav href="/#products" text="☰ All" />
            <MiniNav href="/grocery" text="Grocery" />
            <MiniNav href="/category/Fashion" text="Fashion" />
            <MiniNav href="/category/Electronics" text="Electronics" />
            <MiniNav href="/category/Home%20%26%20Kitchen" text="Home" />
            <MiniNav href="/category/Sports" text="Sports" />
            <MiniNav href="/#flash-sale" text="Deals" />
            <MiniNav href="/become-seller" text="Seller" />
            <MiniNav href="/help-center" text="Help" />
          </div>
        </div>

        {open && (
          <div className="border-t bg-white px-4 py-4 text-black md:hidden">
            <div className="mb-3 rounded-2xl bg-[#eef8ff] p-3">
              <p className="text-xs text-gray-500">Welcome</p>
              <p className="font-black">{displayName || "Guest User"}</p>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-black">
                <MapPin size={15} /> {country}
              </button>

              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-black outline-none"
              >
                <option value="EN">English</option>
                <option value="HI">Hindi</option>
              </select>
            </div>

            <div className="grid gap-1">
              <MobileLink href="/account" icon={<User size={18} />} text="My Account" />
              <MobileLink href="/my-orders" icon={<Box size={18} />} text="My Orders" />
              <MobileLink href="/coupons" icon={<TicketPercent size={18} />} text="Coupons" />
              <MobileLink href="/wishlist" icon={<Heart size={18} />} text="Wishlist" />
              <MobileLink href="/notifications" icon={<Bell size={18} />} text="Notifications" />
              <MobileLink href="/help-center" icon={<HelpCircle size={18} />} text="Help & Support" />
              <MobileLink href="/become-seller" icon={<Store size={18} />} text="Become Seller" />
              <MobileLink href="/category/Sports" icon={<Trophy size={18} />} text="Sports" />

              {isAdmin && (
                <MobileLink href="/admin" icon={<ShieldCheck size={18} />} text="Admin Panel" />
              )}

              {isSeller && (
                <MobileLink href="/seller/dashboard" icon={<Store size={18} />} text="Seller Dashboard" />
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
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-2 py-1 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden">
        <div className="grid grid-cols-5 text-[11px] font-bold text-gray-600">
          <BottomLink href="/" icon={<Home size={22} />} text="Home" />
          <BottomLink href="/#products" icon={<Grid3X3 size={22} />} text="Products" />
          <BottomLink href="/become-seller" icon={<Store size={22} />} text="Seller" />
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
        className="rounded-2xl px-3 py-2 text-left text-sm transition hover:bg-white/10"
      >
        <p className="text-xs text-white/70">
          {displayName ? `Hello, ${displayName}` : "Hello, Sign in"}
        </p>
        <p className="font-black text-white">Account {accountOpen ? "▲" : "▼"}</p>
      </button>

      {accountOpen && (
        <div className="absolute right-0 mt-2 w-[330px] overflow-hidden rounded-[1.5rem] bg-white text-black shadow-2xl ring-1 ring-gray-200">
          <div className="bg-[#eef8ff] px-5 py-4">
            <p className="text-xs font-bold text-gray-500">Your Account</p>
            <h2 className="truncate text-lg font-black">
              {displayName || "Guest User"}
            </h2>
          </div>

          {(isAdmin || isSeller) && (
            <div className="mx-3 mt-3 flex gap-2">
              {isAdmin && (
                <Link href="/admin" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-3 py-2.5 text-xs font-black text-white">
                  <LayoutDashboard size={15} /> Admin
                </Link>
              )}
              {isSeller && (
                <Link href="/seller/dashboard" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b5c45] px-3 py-2.5 text-xs font-black text-white">
                  <Store size={15} /> Seller
                </Link>
              )}
            </div>
          )}

          <div className="m-3 rounded-2xl bg-white p-2 ring-1 ring-gray-100">
            <CompactDropLink href="/account" icon={<User size={17} />} text="My Profile" />
            <CompactDropLink href="/my-orders" icon={<PackageCheck size={17} />} text="Orders" />
            <CompactDropLink href="/coupons" icon={<TicketPercent size={17} />} text="Coupons" />
            <CompactDropLink href="/wallet" icon={<Wallet size={17} />} text="Saved Cards & Wallet" />
            <CompactDropLink href="/wishlist" icon={<Heart size={17} />} text="Wishlist" />
            <CompactDropLink href="/notifications" icon={<Bell size={17} />} text="Notifications" />
            <CompactDropLink href="/help-center" icon={<HelpCircle size={17} />} text="Help & Support" />
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
                Logout
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

function LanguageSelect({
  language,
  changeLanguage,
}: {
  language: string;
  changeLanguage: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2">
      <Languages size={15} />
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-xs font-black text-white outline-none"
      >
        <option className="text-black" value="EN">EN</option>
        <option className="text-black" value="HI">HI</option>
      </select>
    </div>
  );
}

function TopMiniButton({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <button className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-black">
      {icon}
      {text}
    </button>
  );
}

function MiniNav({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="shrink-0 rounded-full px-3 py-1.5 hover:bg-[#eef8ff] hover:text-[#0b5c45]">
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
      <span className="text-[#0b5c45]">{icon}</span>
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
    <Link href={href} className="group flex w-full items-center justify-between rounded-xl px-3 py-2 hover:bg-[#eef8ff]">
      <div className="flex items-center gap-3">
        <span className="text-gray-500 group-hover:text-[#0b5c45]">{icon}</span>
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
      <span className="text-[#0b5c45]">{icon}</span>
      {text}
    </Link>
  );
}