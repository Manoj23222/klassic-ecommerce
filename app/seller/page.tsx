import Header from "@/components/Header";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SellerDashboardPage() {
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
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [userId]
  );

  const user = users[0];

  if (!user || user.role !== "seller") {
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
    "SELECT COUNT(*) as total FROM products WHERE seller_id = ?",
    [userId]
  );

  const [lowStock]: any = await db.query(
    "SELECT COUNT(*) as total FROM products WHERE seller_id = ? AND stock <= 5",
    [userId]
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome, {user.name}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">My Products</p>
            <h2 className="text-3xl font-bold">{products[0].total}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <h2 className="text-3xl font-bold text-red-600">{lowStock[0].total}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Seller Status</p>
            <h2 className="text-xl font-bold text-green-600">Active</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Trust Score</p>
            <h2 className="text-3xl font-bold text-blue-600">80%</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Link href="/seller/products" className="bg-blue-600 text-white p-5 rounded-xl text-center font-bold">
            📦 My Products
          </Link>

          <Link href="/seller/add-product" className="bg-green-600 text-white p-5 rounded-xl text-center font-bold">
            ➕ Add Product
          </Link>

          <Link href="/seller/orders" className="bg-purple-600 text-white p-5 rounded-xl text-center font-bold">
            🚚 My Orders
          </Link>
        </div>
      </section>
    </main>
  );
}