import mongoose from "mongoose";
import SellerTopBar from "@/components/SellerTopBar";
import { cookies } from "next/headers";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function SellerInventoryPage() {
  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link href="/seller/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Seller Login
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

if (!mongoose.Types.ObjectId.isValid(sellerId)) {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login again</h1>
        <Link
          href="/seller/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Seller Login
        </Link>
      </div>
    </main>
  );
}

const seller: any = await Seller.findById(sellerId).select("_id status").lean();
  if (!seller || seller.status !== "Approved") {
    return (
      <main className="min-h-screen bg-gray-100">
        <SellerTopBar />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Seller access required</h1>
          <Link href="/become-seller" className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
            Become a Seller
          </Link>
        </div>
      </main>
    );
  }

  const products: any[] = await Product.find({ seller_id: sellerId })
    .sort({ stock: 1 })
    .lean();

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => Number(p.stock || 0) <= 0).length;
  const lowStock = products.filter(
    (p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5
  ).length;

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <SellerTopBar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="mt-5 mb-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">
            Stock, low-stock aur out-of-stock products manage karo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Products" value={totalProducts} color="text-gray-900" />
          <Stat title="Total Stock" value={totalStock} color="text-blue-600" />
          <Stat title="Low Stock" value={lowStock} color="text-orange-600" />
          <Stat title="Out of Stock" value={outOfStock} color="text-red-600" />
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">SKU</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product: any) => {
                  const stock = Number(product.stock || 0);

                  const stockStatus =
                    stock <= 0
                      ? "Out of Stock"
                      : stock <= 5
                      ? "Low Stock"
                      : "In Stock";

                  return (
                    <tr key={String(product._id)} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                          )}

                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.status}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">{product.sku || "-"}</td>
                      <td className="p-4">{product.category || "General"}</td>

                      <td className="p-4 font-bold">{stock}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            stock <= 0
                              ? "bg-red-100 text-red-700"
                              : stock <= 5
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {stockStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/seller/products/edit/${String(product._id)}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                        >
                          Update Stock
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}