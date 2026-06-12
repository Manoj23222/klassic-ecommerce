import Header from "@/components/Header";
import MyOrdersClient from "@/components/MyOrdersClient";
import Link from "next/link";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />

        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Please login first
          </h1>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>
        </section>
      </main>
    );
  }

  await connectDB();

  const orders = await Order.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .lean();

  const cleanOrders = orders.map((order: any) => ({
    id: order._id.toString(),
    customer_name: order.customer_name,
    phone: order.phone,
    status: order.status,
    total_amount: Number(order.total_amount || 0),
    payment_method: order.payment_method,
    created_at: order.createdAt ? String(order.createdAt) : "",
  }));

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          › My Account › My Orders
        </div>

        <MyOrdersClient orders={cleanOrders} />
      </section>
    </main>
  );
}