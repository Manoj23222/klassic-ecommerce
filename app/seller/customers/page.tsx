import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SellerCustomersPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/seller"
          className="text-blue-600 font-semibold"
        >
          ← Back to Seller Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Customers
              </h1>

              <p className="text-gray-500">
                Customers who purchased your products.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Total Customers</p>
              <h2 className="text-3xl font-bold text-blue-700">0</h2>
            </div>

            <div className="bg-green-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Repeat Customers</p>
              <h2 className="text-3xl font-bold text-green-700">0</h2>
            </div>

            <div className="bg-yellow-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">New Customers</p>
              <h2 className="text-3xl font-bold text-yellow-700">0</h2>
            </div>

            <div className="bg-purple-50 p-5 rounded-xl border">
              <p className="text-sm text-gray-500">Customer Rating</p>
              <h2 className="text-3xl font-bold text-purple-700">0.0</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Orders</th>
                  <th className="p-4 text-left">Spent</th>
                  <th className="p-4 text-left">Last Order</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-gray-500"
                  >
                    No customers found
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
