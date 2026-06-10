import Header from "@/components/Header";
import db from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SellerOrdersPage() {
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

  const [orders]: any = await db.query(
    `
    SELECT 
      oi.id as item_id,
      oi.order_id,
      oi.product_name,
      oi.price,
      oi.quantity,
      oi.color,
      oi.size,
      o.customer_name,
      o.phone,
      o.address,
      o.status,
      o.created_at
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE p.seller_id = ?
    ORDER BY o.id DESC
    `,
    [userId]
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/seller" className="text-blue-600 font-semibold">
          ← Back to Seller Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Seller Orders</h1>
            <p className="text-gray-500 text-sm">
              Orders received for your products.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Order</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-5 text-center text-gray-500">
                    No seller orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.item_id}>
                    <td className="border p-2 font-bold">
                      #{order.order_id}
                    </td>

                    <td className="border p-2">
                      <p className="font-bold">{order.product_name}</p>
                      <p className="text-xs text-gray-500">
                        {order.color && `Color: ${order.color} `}
                        {order.size && `Size: ${order.size}`}
                      </p>
                    </td>

                    <td className="border p-2">{order.customer_name || "Guest"}</td>
                    <td className="border p-2">{order.phone || "-"}</td>
                    <td className="border p-2">{order.quantity}</td>

                    <td className="border p-2 font-bold text-green-600">
                      ₹{(Number(order.price) * Number(order.quantity)).toFixed(2)}
                    </td>

                    <td className="border p-2">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                        {order.status || "Pending"}
                      </span>
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