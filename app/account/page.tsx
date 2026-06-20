import AccountProfileForm from "@/components/AccountProfileForm";
import Header from "@/components/Header";
import AccountAddressForm from "@/components/AccountAddressForm";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f1f3f6]">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="mb-4 text-2xl font-black">
              Please Login First
            </h1>

            <Link
              href="/login"
              className="rounded-xl bg-black px-6 py-3 text-sm font-black text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20">
      <Header />

      <div className="mx-auto max-w-7xl px-3 py-3 md:px-6 md:py-6">
        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">

          {/* LEFT SIDEBAR */}

          <aside className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-2xl">
                  👤
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Hello,
                  </p>

                  <h2 className="text-base font-black">
                    {user.name}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">

              <Link
                href="/my-orders"
                className="flex items-center justify-between border-b p-4 hover:bg-gray-50"
              >
                <span className="text-sm font-black">
                  📦 My Orders
                </span>

                <span>›</span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between border-b p-4 hover:bg-gray-50"
              >
                <span className="text-sm font-black">
                  ❤️ Wishlist
                </span>

                <span>›</span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between border-b p-4 hover:bg-gray-50"
              >
                <span className="text-sm font-black">
                  🛒 Cart
                </span>

                <span>›</span>
              </Link>

              <div className="p-4">
                <h3 className="mb-3 text-xs font-black uppercase text-gray-400">
                  Payments
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gift Cards</span>
                    <b className="text-green-600">₹0</b>
                  </div>

                  <div>Saved UPI</div>
                  <div>Saved Cards</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MiniCard title="Orders" value="0" />
              <MiniCard title="Wishlist" value="0" />
              <MiniCard title="Coupons" value="0" />
            </div>
          </aside>

          {/* RIGHT CONTENT */}

          <section className="space-y-3">

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h1 className="text-xl font-black">
                My Account
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Manage your profile, addresses and account settings.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <AccountProfileForm
                user={{
                  name: user.name,
                  email: user.email,
                  role: user.role,
                }}
              />
            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <AccountAddressForm />
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}

function MiniCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <p className="text-lg font-black">
        {value}
      </p>

      <p className="text-[10px] font-bold text-gray-500">
        {title}
      </p>
    </div>
  );
}