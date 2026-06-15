import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RejectedProductsPage() {
  await connectDB();

  const products = await Product.find({
    status: "Rejected",
  })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Rejected Products
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Products rejected by admin.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
          <h2 className="text-xl font-bold">
            No rejected products
          </h2>

          <p className="text-gray-500 mt-2">
            Great! No rejected products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {products.map((item: any) => (
            <div
              key={String(item._id)}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-28 h-28 object-contain rounded-xl border bg-gray-50"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg line-clamp-2">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Seller:{" "}
                    {item.seller_store_name ||
                      "Unknown Seller"}
                  </p>

                  <p className="text-sm text-gray-500">
                    SKU: {item.sku || "N/A"}
                  </p>

                  <p className="font-semibold mt-2">
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Rejected
                    </span>

                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <h3 className="font-semibold text-red-700 mb-1">
                    Reject Reason
                  </h3>

                  <p className="text-sm text-gray-700">
                    {item.reject_reason ||
                      item.approval_comment ||
                      "No reason provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    href={`/admin/products/edit/${item._id}`}
                    className="bg-gray-900 hover:bg-black text-white text-center py-2 rounded-xl font-semibold"
                  >
                    View Product
                  </Link>

                  <form
                    action={`/admin/products/edit/${item._id}`}
                  >
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold"
                    >
                      Recheck
                    </button>
                  </form>
                </div>

                {item.rejected_at && (
                  <p className="text-xs text-gray-400 mt-3">
                    Rejected:
                    {" "}
                    {new Date(
                      item.rejected_at
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}