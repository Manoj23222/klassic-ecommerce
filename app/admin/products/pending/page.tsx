import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductApprovalActions from "@/components/admin/ProductApprovalActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PendingProductsPage() {
  await connectDB();

  const products = await Product.find({ status: "Pending Approval" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Product Approval Center
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review seller submitted products before publishing.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border">
          <h2 className="text-xl font-bold">No pending products</h2>
          <p className="text-gray-500 mt-2">All products are reviewed.</p>
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
                    Seller: {item.seller_store_name || "Klassic Seller"}
                  </p>

                  <p className="text-sm text-gray-500">
                    SKU: {item.sku || "N/A"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Pending Approval
                    </span>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <ProductApprovalActions productId={String(item._id)} />

                <Link
                  href={`/admin/products/edit/${String(item._id)}`}
                  className="block text-center mt-3 bg-gray-900 text-white py-2 rounded-xl text-sm font-semibold"
                >
                  View / Edit Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}