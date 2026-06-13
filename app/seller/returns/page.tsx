import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerReturnsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/seller/orders"
          className="text-blue-600 font-semibold"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Returns & Refunds
          </h1>

          <p className="text-gray-500 mb-6">
            Manage customer return and refund requests.
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Return Requests
              </p>
              <h2 className="text-3xl font-bold text-yellow-700">
                0
              </h2>
            </div>

            <div className="bg-blue-50 border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Under Review
              </p>
              <h2 className="text-3xl font-bold text-blue-700">
                0
              </h2>
            </div>

            <div className="bg-green-50 border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Approved
              </p>
              <h2 className="text-3xl font-bold text-green-700">
                0
              </h2>
            </div>

            <div className="bg-red-50 border rounded-xl p-5">
              <p className="text-sm text-gray-500">
                Rejected
              </p>
              <h2 className="text-3xl font-bold text-red-700">
                0
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Request ID</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No return requests found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}