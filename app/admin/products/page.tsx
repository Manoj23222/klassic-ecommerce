import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProducts() {
  await connectDB();

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(products));
}

function statusColor(status: string) {
  if (status === "Approved")
    return "bg-green-100 text-green-700";

  if (status === "Rejected")
    return "bg-red-100 text-red-700";

  if (status === "Draft")
    return "bg-gray-100 text-gray-700";

  return "bg-yellow-100 text-yellow-700";
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Product Management
            </h1>

            <p className="text-gray-600">
              Approve or reject seller products
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow">
              Total: {products.length}
            </div>

            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl">
              Pending: {
                products.filter(
                  (p: any) =>
                    p.status === "Pending Approval"
                ).length
              }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">
                    Product
                  </th>

                  <th className="p-4 text-left">
                    Seller
                  </th>

                  <th className="p-4 text-left">
                    Category
                  </th>

                  <th className="p-4 text-left">
                    Price
                  </th>

                  <th className="p-4 text-left">
                    Stock
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product: any) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                        )}

                        <div>
                          <h3 className="font-semibold">
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {product.seller_store_name ||
                        "Seller"}
                    </td>

                    <td className="p-4">
                      {product.category}
                    </td>

                    <td className="p-4">
                      ₹{product.price}
                    </td>

                    <td className="p-4">
                      {product.stock}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="p-4">
  <div className="flex flex-wrap gap-2">

    <Link
      href={`/admin/products/${product._id}`}
      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
    >
      View
    </Link>

    <Link
      href={`/admin/product/edit/${product._id}`}
      className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
    >
      Edit
    </Link>

    <button
      className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
      onClick={async () => {
        if (!confirm("Delete product?")) return;

        await fetch("/api/admin/delete-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: product._id,
          }),
        });

        window.location.reload();
      }}
    >
      Delete
    </button>

  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}