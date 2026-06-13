import SellerTopBar from "@/components/SellerTopBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function InventoryHistoryPage() {
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
            Inventory History
          </h1>

          <p className="text-gray-500 mb-6">
            Stock changes and inventory movement records.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Action</th>
                  <th className="p-4 text-left">Old Stock</th>
                  <th className="p-4 text-left">New Stock</th>
                  <th className="p-4 text-left">Updated By</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No inventory history found
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