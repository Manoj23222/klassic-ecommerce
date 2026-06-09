import Header from "@/components/Header";
import db from "@/lib/db";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />

        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login first</h1>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Login
          </Link>
        </section>
      </main>
    );
  }

  const [orders]: any = await db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-6">My Orders</h1>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="p-3 border">#{order.id}</td>
                  <td className="p-3 border">
                    {order.customer_name || "Guest"}
                  </td>
                  <td className="p-3 border">{order.phone || "-"}</td>
                  <td className="p-3 border">₹{order.total_amount}</td>
                  <td className="p-3 border">{order.status}</td>
                  <td className="p-3 border">
                    <Link
                      href={`/my-orders/${order.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={6}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}