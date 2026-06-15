import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ApprovedProductsPage() {
  await connectDB();

  const products = await Product.find({
    status: "Approved",
  })
    .sort({ approved_at: -1, createdAt: -1 })
    .lean();

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Approved Products
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          All approved marketplace products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
          <h2 className="text-xl font-bold">
            No approved products
          </h2>

          <p className="text-gray-500 mt-2">
            No products have been approved yet.
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

                <div className="flex-1">
                  <h2 className="font-bold text-lg line-clamp-2">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Seller: {item.seller_store_name || "Klassic Seller"}
                  </p>

                  <p className="text-sm text-gray-500">
                    SKU: {item.sku || "N/A"}
                  </p>

                  <p className="font-semibold mt-2">
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Approved
                    </span>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category || "General"}
                    </span>

                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/admin/products/edit/${item._id}`}
                    className="bg-gray-900 hover:bg-black text-white text-center py-2 rounded-xl font-semibold"
                  >
                    Edit Product
                  </Link>

                  <Link
                    href={`/product/${item._id}`}
                    target="_blank"
                    className="bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-xl font-semibold"
                  >
                    View Live
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-bold">{item.views || 0}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-xs text-gray-500">Sales</p>
                    <p className="font-bold">{item.sales_count || 0}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-bold">
                      {Number(item.rating || 0).toFixed(1)}
                    </p>
                  </div>
                </div>

                {item.approved_at && (
                  <p className="text-xs text-gray-400 mt-3">
                    Approved:
                    {" "}
                    {new Date(item.approved_at).toLocaleDateString("en-IN")}
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