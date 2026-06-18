import UpdateOrderStatus from "@/components/UpdateOrderStatus";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const steps = [
  "Pending",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

function statusColor(status: string) {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Out For Delivery") return "bg-indigo-100 text-indigo-700";
  if (status === "Packed") return "bg-cyan-100 text-cyan-700";
  if (status === "Processing") return "bg-purple-100 text-purple-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1 className="p-10 text-3xl font-black">Invalid order ID</h1>;
  }

  const order: any = await Order.findById(id).lean();

  if (!order) {
    return <h1 className="p-10 text-3xl font-black">Order not found</h1>;
  }

  const orderId = String(order._id);
  const items = order.items || [];
  const currentStep = steps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/orders"
          className="mb-5 inline-flex rounded-xl bg-gray-900 px-4 py-2 font-bold text-white"
        >
          ← Back to Orders
        </Link>

        <div className="mb-6 rounded-3xl bg-white p-5 shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">ORDER DETAILS</p>
              <h1 className="text-3xl font-black md:text-4xl">
                Order #{orderId.slice(-6).toUpperCase()}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN")
                  : "-"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-4 py-2 text-xs font-black ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                {order.payment_method}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700">
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-2xl font-black">Order Tracking</h2>

              <div className="grid gap-3 md:grid-cols-6">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={
                      index <= currentStep
                        ? "rounded-2xl bg-green-100 p-3 text-center text-sm font-black text-green-700"
                        : "rounded-2xl bg-gray-100 p-3 text-center text-sm font-bold text-gray-500"
                    }
                  >
                    {index <= currentStep ? "✅ " : "○ "}
                    {step}
                  </div>
                ))}
              </div>

              {order.status === "Cancelled" && (
                <div className="mt-4 rounded-xl bg-red-100 p-3 font-black text-red-700">
                  This order has been cancelled.
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-2xl font-black">Order Items</h2>

              <div className="space-y-4">
                {items.map((item: any, index: number) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="grid gap-4 rounded-2xl border bg-slate-50 p-4 md:grid-cols-[80px_1fr_160px]"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-20 w-20 rounded-xl bg-white object-contain"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-gray-200" />
                    )}

                    <div>
                      <h3 className="text-lg font-black">
                        {item.product_name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Product ID: {item.product_id}
                      </p>

                      <p className="text-xs text-gray-500">
                        Seller: {item.seller_store_name || item.seller_id || "-"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                        {item.color && <span>Color: <b>{item.color}</b></span>}
                        {item.size && <span>Size: <b>{item.size}</b></span>}
                        <span>Qty: <b>{item.quantity || 1}</b></span>
                      </div>

                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-black ${statusColor(
                          item.item_status || order.status
                        )}`}
                      >
                        {item.item_status || order.status}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-black text-green-600">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ₹
                        {(
                          Number(item.price || 0) * Number(item.quantity || 1)
                        ).toFixed(2)}
                      </p>

                      {item.tracking_number && (
                        <p className="mt-2 text-xs text-gray-500">
                          Tracking: {item.tracking_number}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-black">Customer Details</h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <b>Name:</b> {order.customer_name || "N/A"}
                </p>
                <p>
                  <b>Phone:</b> {order.phone || "N/A"}
                </p>
                <p>
                  <b>Address:</b> {order.address || "N/A"}
                </p>

                {(order.city || order.state || order.pincode) && (
                  <p>
                    <b>City:</b>{" "}
                    {[order.city, order.state, order.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {order.landmark && (
                  <p>
                    <b>Landmark:</b> {order.landmark}
                  </p>
                )}

                <p>
                  <b>Address Type:</b> {order.address_type || "Home"}
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-black">Payment Summary</h2>

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={order.subtotal || 0} />
                <Row label="Discount" value={-Number(order.discount || 0)} green />
                <Row label="Delivery" value={order.delivery_charge || 0} />
                <Row label="GST" value={order.gst_amount || 0} />

                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between text-xl font-black text-green-600">
                    <span>Total</span>
                    <span>₹{Number(order.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <p className="pt-2">
                  <b>Payment:</b> {order.payment_method || "COD"}
                </p>
                <p>
                  <b>Payment Status:</b> {order.payment_status || "Pending"}
                </p>
                <p>
                  <b>Coupon:</b> {order.coupon_code || "No Coupon"}
                </p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-black">Update Status</h2>

              <UpdateOrderStatus
                orderId={orderId as any}
                currentStatus={order.status}
              />
            </section>

            <div className="grid gap-3">
              <Link
                href={`/admin/orders/${orderId}/invoice`}
                className="block rounded-2xl bg-green-600 px-4 py-3 text-center font-black text-white hover:bg-green-700"
              >
                Download Invoice
              </Link>

              <Link
                href="/admin/orders"
                className="block rounded-2xl bg-slate-950 px-4 py-3 text-center font-black text-white"
              >
                Back to Orders
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
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