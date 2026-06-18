import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

function statusColor(status: string) {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  if (status === "Processing") return "bg-purple-100 text-purple-700";
  return "bg-yellow-100 text-yellow-700";
}

export default async function AdminOrdersPage() {
  await connectDB();

  const orders: any[] = await Order.find().sort({ createdAt: -1 }).lean();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  return (
    <main>
      <h1 className="mb-6 text-4xl font-black">Admin Orders</h1>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Card title="Total Orders" value={orders.length} />
        <Card title="Revenue" value={`₹${totalRevenue.toFixed(0)}`} />
        <Card title="Pending" value={orders.filter((o) => o.status === "Pending").length} />
        <Card title="Delivered" value={orders.filter((o) => o.status === "Delivered").length} />
      </section>

      <section className="space-y-4">
        {orders.map((order) => {
          const orderId = String(order._id);

          return (
            <div key={orderId} className="rounded-3xl bg-white p-5 shadow">
              <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500">ORDER ID</p>
                  <h2 className="font-black">#{orderId}</h2>
                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN")
                      : "-"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {order.payment_method}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
                <div className="space-y-3">
                  {(order.items || []).map((item: any, index: number) => (
                    <div key={index} className="flex gap-3 rounded-2xl border bg-slate-50 p-3">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-16 w-16 rounded-xl bg-white object-contain"
                      />

                      <div className="flex-1">
                        <h3 className="font-black">{item.product_name}</h3>
                        <p className="text-xs text-gray-500">
                          Seller: {item.seller_store_name || item.seller_id || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity || 1} | ₹{Number(item.price || 0).toFixed(2)}
                        </p>
                        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black ${statusColor(item.item_status || order.status)}`}>
                          {item.item_status || order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="rounded-2xl border bg-white p-4">
                  <h3 className="font-black">Customer</h3>
                  <p className="mt-2 font-bold">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <p className="mt-2 text-sm text-gray-600">{order.address}</p>

                  <div className="mt-4 border-t pt-4 text-sm">
                    <Row label="Subtotal" value={order.subtotal || 0} />
                    <Row label="Discount" value={-Number(order.discount || 0)} green />
                    <Row label="Delivery" value={order.delivery_charge || 0} />
                    <Row label="GST" value={order.gst_amount || 0} />
                    <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black">
                      <span>Total</span>
                      <span>₹{Number(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/orders/${orderId}`}
                    className="mt-4 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white"
                  >
                    View / Manage
                  </Link>
                </aside>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-black">{value}</h2>
    </div>
  );
}

function Row({
  label,
  value,
  green = false,
}: {
  label: string;
  value: number;
  green?: boolean;
}) {
  return (
    <div className={`flex justify-between ${green ? "text-green-600" : ""}`}>
      <span>{label}</span>
      <b>₹{Number(value || 0).toFixed(2)}</b>
    </div>
  );
}