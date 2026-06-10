import Header from "@/components/Header";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SellerProductsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login first</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Login
          </Link>
        </div>
      </main>
    );
  }

  const [users]: any = await db.query(
    "SELECT id, role FROM users WHERE id = ?",
    [userId]
  );

  if (!users[0] || users[0].role !== "seller") {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Seller access required</h1>
          <Link href="/become-seller" className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
            Become a Seller
          </Link>
        </div>
      </main>
    );
  }

  const [products]: any = await db.query(
    "SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC",
    [userId]
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Products</h1>
            <p className="text-gray-500 text-sm">
              Manage your listed products.
            </p>
          </div>

          <Link
            href="/seller/add-product"
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold text-center"
          >
            ➕ Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Image</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Preview</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border p-5 text-center text-gray-500">
                    No products added yet
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="border p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-contain bg-gray-100 rounded"
                      />
                    </td>

                    <td className="border p-2 font-bold">
                      {product.name}
                    </td>

                    <td className="border p-2">
                      {product.category || "General"}
                    </td>

                    <td className="border p-2 font-bold text-green-600">
                      ₹{Number(product.price).toFixed(2)}
                    </td>

                    <td className="border p-2">
                      <span
                        className={
                          product.stock <= 5
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-bold"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="border p-2">
                      <Link
                        href={`/product/${product.id}`}
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
      </section>
    </main>
  );
}