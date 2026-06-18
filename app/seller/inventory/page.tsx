import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function SellerInventoryPage() {
  await connectDB();

  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-black">Please login first</h1>
      </main>
    );
  }

  const products = await Product.find({ seller_id: sellerId })
    .sort({ stock: 1 })
    .lean();

  const cleanProducts = products.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    seller_id: item.seller_id?.toString?.() || item.seller_id,
    createdAt: item.createdAt?.toISOString?.() || "",
    updatedAt: item.updatedAt?.toISOString?.() || "",
  }));

  const totalProducts = cleanProducts.length;
  const totalStock = cleanProducts.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );
  const lowStock = cleanProducts.filter(
    (item) => Number(item.stock || 0) > 0 && Number(item.stock || 0) <= 5
  ).length;
  const outOfStock = cleanProducts.filter(
    (item) => Number(item.stock || 0) <= 0
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Inventory Center</h1>
          <p className="text-gray-500">
            Track stock, low-stock products, and out-of-stock items.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InventoryCard title="Products" value={totalProducts} />
          <InventoryCard title="Total Stock" value={totalStock} />
          <InventoryCard title="Low Stock" value={lowStock} />
          <InventoryCard title="Out of Stock" value={outOfStock} />
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-xl font-black">Stock List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">SKU</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Approval</th>
                </tr>
              </thead>

              <tbody>
                {cleanProducts.map((item: any) => {
                  const stock = Number(item.stock || 0);

                  return (
                    <tr key={item._id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-black">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold">{item.sku || "-"}</td>

                      <td className="p-4">{item.category || "General"}</td>

                      <td className="p-4 font-black">{stock}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            stock <= 0
                              ? "bg-red-100 text-red-700"
                              : stock <= 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {stock <= 0
                            ? "Out of Stock"
                            : stock <= 5
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100">
                          {item.status || "Pending Approval"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {cleanProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function InventoryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm font-bold">{title}</p>
      <h2 className="text-3xl font-black mt-2">{value}</h2>
    </div>
  );
}