import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerStoreSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Store Settings
          </h1>

          <p className="text-gray-500 mb-6">
            Manage store preferences and seller options.
          </p>

          <div className="space-y-5">
            <div className="border rounded-xl p-4">
              <label className="font-bold block mb-2">
                Store Visibility
              </label>

              <select className="w-full border p-3 rounded-xl">
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <div className="border rounded-xl p-4">
              <label className="font-bold block mb-2">
                Return Policy
              </label>

              <textarea
                className="w-full border p-3 rounded-xl h-28"
                placeholder="Enter return policy..."
              />
            </div>

            <div className="border rounded-xl p-4">
              <label className="font-bold block mb-2">
                Shipping Policy
              </label>

              <textarea
                className="w-full border p-3 rounded-xl h-28"
                placeholder="Enter shipping policy..."
              />
            </div>

            <div className="border rounded-xl p-4">
              <label className="font-bold block mb-2">
                Auto Approve Orders
              </label>

              <select className="w-full border p-3 rounded-xl">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <button
              type="button"
              className="bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              Save Settings
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}