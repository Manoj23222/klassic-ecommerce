import AccountProfileForm from "@/components/AccountProfileForm";
import Header from "@/components/Header";
import AccountAddressForm from "@/components/AccountAddressForm";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />

        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-5 md:py-8 grid lg:grid-cols-[320px_1fr] gap-5">
        <aside className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-300 flex items-center justify-center text-2xl md:text-3xl">
              👤
            </div>

            <div>
              <p className="text-xs md:text-sm">Hello,</p>
              <h2 className="text-lg md:text-xl font-bold">{user.name}</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <Link
              href="/my-orders"
              className="flex items-center justify-between p-4 md:p-5 border-b hover:bg-gray-50"
            >
              <span className="font-bold text-gray-600 text-sm md:text-base">
                📦 MY ORDERS
              </span>
              <span>›</span>
            </Link>

            <div className="p-4 md:p-5 border-b">
              <h3 className="font-bold text-gray-500 mb-4 text-sm md:text-base">
                👤 ACCOUNT SETTINGS
              </h3>

              <div className="space-y-3 pl-1 md:pl-2 text-sm md:text-base">
                <p className="text-blue-600 font-bold bg-blue-50 p-3 rounded-lg">
                  Profile Information
                </p>

            
              </div>
            </div>

            <div className="p-4 md:p-5">

              <div className="space-y-3 pl-1 md:pl-2 text-sm md:text-base">
                <p className="flex justify-between">
                  <span>Gift Cards</span>
                  <b className="text-green-600">₹0</b>
                </p>

                <p>Saved UPI</p>
                <p>Saved Cards</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          <AccountProfileForm
            user={{
              name: user.name,
              email: user.email,
              role: user.role,
          
            }}
          />

          <AccountAddressForm />
        </section>
      </div>
    </main>
  );
}