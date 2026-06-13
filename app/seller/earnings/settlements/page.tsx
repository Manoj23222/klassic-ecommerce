import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerSettlementHistoryPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller/earnings" className="text-blue-600 font-semibold">
          ← Back to Earnings
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">Settlement History</h1>
          <p className="text-gray-500 mb-6">
            Seller settlement records yahan show honge.
          </p>

          <div className="p-10 text-center text-gray-500 border rounded-2xl">
            No settlements yet
          </div>
        </div>
      </section>
    </main>
  );
}