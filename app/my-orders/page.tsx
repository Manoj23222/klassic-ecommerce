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
          <h1 className="text-3xl font-bold mb-4">
            Please login first
          </h1>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            📦 My Orders
          </h1>

          <Link
            href="/"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-5">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <h2 className="text-2xl font-bold">
                    #{order.id}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    👤 {order.customer_name || "Guest"}
                  </p>

                  <p className="text-gray-600">
                    📞 {order.phone || "-"}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Order Date:
                    {" "}
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <h2 className="text-3xl font-bold text-green-600">
                    ₹{order.total_amount}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-2 px-4 py-2 rounded-full font-bold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center">
                  <Link
                    href={`/my-orders/${order.id}`}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h2 className="text-3xl font-bold">
                No Orders Yet
              </h2>

              <p className="text-gray-500 mt-3">
                Start shopping and your orders will appear here.
              </p>

              <Link
                href="/"
                className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}