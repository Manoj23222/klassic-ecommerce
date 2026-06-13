import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LowStockPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/seller/inventory"
          className="text-blue-600 font-semibold"
        >
          ← Back to Inventory
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-5">
          <h1 className="text-3xl font-bold mb-2">
            Low Stock Alert
          </h1>

          <p className="text-gray-500 mb-6">
            Products with stock less than or equal to 5.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm text-red-600">Critical Stock</p>
              <h2 className="text-3xl font-bold text-red-700">0</h2>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <p className="text-sm text-yellow-600">Low Stock</p>
              <h2 className="text-3xl font-bold text-yellow-700">0</h2>
            </div>

            <div className="bg-gray-50 border rounded-xl p-5">
              <p className="text-sm text-gray-600">Out Of Stock</p>
              <h2 className="text-3xl font-bold text-gray-900">0</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">SKU</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-gray-500"
                  >
                    No low stock products found
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