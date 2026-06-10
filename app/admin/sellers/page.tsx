import db from "@/lib/db";
import Link from "next/link";

export default async function AdminSellersPage() {
  const [sellers]: any = await db.query(
    "SELECT * FROM seller_requests ORDER BY id DESC"
  );

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Seller Requests
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Store</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-5 text-center text-gray-500">
                  No seller requests yet
                </td>
              </tr>
            ) : (
              sellers.map((seller: any) => (
                <tr key={seller.id}>
                  <td className="border p-2">{seller.id}</td>
                  <td className="border p-2 font-bold">{seller.store_name}</td>
                  <td className="border p-2">{seller.name}</td>
                  <td className="border p-2">{seller.phone}</td>
                  <td className="border p-2">{seller.category}</td>
                  <td className="border p-2">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-xs">
                      {seller.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    <Link
                      href={`/admin/sellers/${seller.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}