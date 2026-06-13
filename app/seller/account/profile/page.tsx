import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Seller Profile
          </h1>

          <p className="text-gray-500 mb-6">
            Manage your seller account information.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Store Name"
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              placeholder="Seller Bio"
              className="w-full border p-3 rounded-xl h-32"
            />

            <button
              type="button"
              className="bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              Save Profile
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}