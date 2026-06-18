import Header from "@/components/Header";
import Link from "next/link";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

function getStatusText(order: any) {
  if (order.status === "Delivered") return "Delivered successfully ✅";
  if (order.status === "Cancelled") return "Order cancelled";
  if (order.status === "Shipped") return "Arriving soon 🚚";
  if (order.status === "Processing") return "Preparing your order";
  return "Order placed successfully";
}

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#fafafa]">
        <Header />
        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-black">Please login first</h1>
          <Link
            href="/login"
            className="rounded-full bg-black px-8 py-3 font-black text-white"
          >
            Login
          </Link>
        </section>
      </main>
    );
  }

  await connectDB();

  const rawOrders: any[] = await Order.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .lean();

  const orders = rawOrders.map((order: any) => ({
    ...order,
    _id: order._id.toString(),
    createdAt: order.createdAt?.toISOString?.() || "",
    updatedAt: order.updatedAt?.toISOString?.() || "",
  }));

  const activeOrders = orders.filter(
    (o) => !["Delivered", "Cancelled", "Refunded"].includes(o.status)
  );

  const completedOrders = orders.filter((o) => o.status === "Delivered");

  const returnOrders = orders.filter((o) =>
    ["Cancelled", "Return Requested", "Refunded"].includes(o.status)
  );

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <p className="text-sm font-bold text-gray-400">
            Account / Order History
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            My Orders
          </h1>

          <p className="mt-2 text-sm font-semibold text-gray-500">
            View your orders. All actions are available inside order details.
          </p>
        </div>

        <div className="mb-8 flex gap-8 overflow-x-auto border-b border-gray-200 text-sm font-black">
          <Tab name="Active Orders" count={activeOrders.length} active />
          <Tab name="Completed" count={completedOrders.length} />
          <Tab name="Returns & Cancellations" count={returnOrders.length} />
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <div className="text-6xl">📦</div>

            <h2 className="mt-4 text-2xl font-black">No orders yet</h2>

            <p className="mt-2 text-gray-500">
              Start shopping and your orders will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-black px-8 py-3 font-black text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Tab({
  name,
  count,
  active = false,
}: {
  name: string;
  count: number;
  active?: boolean;
}) {
  return (
    <button
      className={`shrink-0 pb-4 ${
        active
          ? "border-b-2 border-black text-black"
          : "text-gray-400 hover:text-black"
      }`}
    >
      {name} <span className="ml-1 text-xs">({count})</span>
    </button>
  );
}

function OrderCard({ order }: { order: any }) {
  const orderId = String(order._id);
  const items = order.items || [];
  const firstItem = items[0];

  return (
    <article className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:p-7">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-500">
            Order Placed:{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN")
              : "-"}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm font-black text-gray-900">
            Status: {getStatusText(order)}
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            Total: ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-gray-50 p-4">
        {firstItem ? (
          <div className="flex gap-4">
            <img
              src={firstItem.image || "/placeholder.png"}
              alt={firstItem.product_name || "Product"}
              className="h-24 w-24 rounded-2xl bg-white object-contain p-2"
            />

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-base font-black text-gray-900">
                {firstItem.product_name}
              </h3>

              <p className="mt-2 text-sm font-semibold text-gray-500">
                {firstItem.color ? `Color: ${firstItem.color}` : ""}
                {firstItem.size ? ` | Size: ${firstItem.size}` : ""}
                {` | Qty: ${firstItem.quantity || 1}`}
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                Sold by: {firstItem.seller_store_name || "Klassic Seller"}
              </p>

              {items.length > 1 && (
                <p className="mt-2 text-xs font-black text-gray-400">
                  +{items.length - 1} more item
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm font-semibold text-gray-500">
            Product details not available
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-3xl bg-gray-50 p-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">Total</p>

          <p className="text-xl font-black">
            ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href={`/my-orders/${orderId}`}
          className="rounded-full bg-black px-6 py-3 text-sm font-black text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}