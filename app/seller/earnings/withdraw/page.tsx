import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerWithdrawPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/seller/earnings" className="text-blue-600 font-semibold">
          ← Back to Earnings
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Withdraw Request
          </h1>

          <p className="text-gray-500 mb-6">
            Request payout to your bank account.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Available Balance
              </p>
              <h2 className="text-3xl font-bold text-green-600">
                ₹0
              </h2>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Minimum Withdrawal
              </p>
              <h2 className="text-3xl font-bold">
                ₹500
              </h2>
            </div>
          </div>

          <form className="space-y-4">
            <input
              type="number"
              placeholder="Enter withdrawal amount"
              className="w-full border p-3 rounded-xl"
            />

            <button
              type="button"
              className="bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              Request Withdrawal
            </button>
          </form>

          <div className="mt-8 border rounded-2xl p-5">
            <h3 className="font-bold mb-3">
              Withdrawal History
            </h3>

            <p className="text-gray-500">
              No withdrawal requests found.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}