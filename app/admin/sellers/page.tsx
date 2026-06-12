import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  await connectDB();

  const sellers = await Seller.find({})
    .sort({ createdAt: -1 })
    .lean();

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
                <td
                  colSpan={7}
                  className="border p-5 text-center text-gray-500"
                >
                  No seller requests yet
                </td>
              </tr>
            ) : (
              sellers.map((seller: any) => (
                <tr key={String(seller._id)}>
                  <td className="border p-2">
                    {String(seller._id).slice(-6)}
                  </td>

                  <td className="border p-2 font-bold">
                    {seller.store_name}
                  </td>

                  <td className="border p-2">
                    {seller.name}
                  </td>

                  <td className="border p-2">
                    {seller.phone}
                  </td>

                  <td className="border p-2">
                    {seller.category || "-"}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-xs ${
                        seller.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : seller.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {seller.status}
                    </span>
                  </td>

                  <td className="border p-2">
                    <Link
                      href={`/admin/sellers/${seller._id}`}
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