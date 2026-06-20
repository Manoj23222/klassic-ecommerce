import CancelOrderButton from "@/components/CancelOrderButton";
import Header from "@/components/Header";
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

function getStatusIndex(status: string) {
  if (status === "Cancelled") return -1;
  const index = steps.indexOf(status || "Pending");
  return index >= 0 ? index : 0;
}

function canReturn(order: any) {
  if (order.status !== "Delivered" || !order.updatedAt) return false;

  const deliveredDate = new Date(order.updatedAt);
  const now = new Date();
  const diffDays =
    (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays <= 7 && order.return_status !== "Requested";
}

export default async function MyOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1 className="p-10 text-2xl font-black">Invalid order ID</h1>;
  }

  const order: any = await Order.findById(id).lean();

  if (!order) {
    return <h1 className="p-10 text-2xl font-black">Order not found</h1>;
  }

  const items = order.items || [];
  const orderId = order._id.toString();
  const currentStep = getStatusIndex(order.status || "Pending");

  const subtotal = Number(
    order.subtotal ||
      items.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      )
  );

  const discount = Number(order.discount || 0);
  const deliveryCharge = Number(order.delivery_charge || 0);
  const gstAmount = Number(order.gst_amount || 0);
  const finalTotal = Number(
    order.total_amount || subtotal - discount + deliveryCharge + gstAmount
  );

  const returnAvailable = canReturn(order);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 text-sm font-semibold text-gray-400">
          <Link href="/" className="hover:text-black">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/my-orders" className="hover:text-black">
            My Orders
          </Link>{" "}
          / Order #{orderId.slice(-8).toUpperCase()}
        </div>

        <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                Order Details
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                #{orderId.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 text-sm font-semibold text-gray-500">
                Placed on{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("en-IN")
                  : "-"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Badge text={order.status || "Pending"} />
              <Badge text={order.payment_method || "COD"} light />
              <Badge text={order.payment_status || "Pending"} light />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <LuxuryCard title="Product">
              <div className="space-y-5">
                {items.map((item: any, index: number) => {
                  const itemTotal =
                    Number(item.price || 0) * Number(item.quantity || 1);

                  return (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="rounded-3xl bg-gray-50 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[110px_1fr_140px]">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.product_name || "Product"}
                          className="h-28 w-28 rounded-2xl bg-white object-contain p-2"
                        />

                        <div>
                          <h3 className="line-clamp-2 text-lg font-black text-gray-900">
                            {item.product_name}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-gray-500">
                            {item.color ? `Color: ${item.color}` : ""}
                            {item.size ? ` | Size: ${item.size}` : ""}
                            {` | Qty: ${item.quantity || 1}`}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-500">
                            Sold by:{" "}
                            {item.seller_store_name || "Klassic Seller"}
                          </p>

                          <p className="mt-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            Item Status: {item.item_status || order.status}
                          </p>
                        </div>

                        <div className="md:text-right">
                          <p className="text-xl font-black">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            ₹
                            {Number(item.price || 0).toLocaleString("en-IN")}{" "}
                            each
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <TrackingBar
                status={order.status || "Pending"}
                activeIndex={currentStep}
              />
            </LuxuryCard>

            <LuxuryCard title="Shipping Address">
              <div className="rounded-3xl bg-gray-50 p-5">
                <p className="text-lg font-black">
                  {order.customer_name || "N/A"}
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {order.address || "N/A"}
                </p>

                <div className="mt-3 grid gap-2 text-sm font-semibold text-gray-500 md:grid-cols-2">
                  <p>Phone: {order.phone || "N/A"}</p>
                  <p>Pincode: {order.pincode || "-"}</p>
                  <p>City: {order.city || "-"}</p>
                  <p>State: {order.state || "-"}</p>
                </div>
              </div>
            </LuxuryCard>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-8 lg:h-fit">
            <LuxuryCard title="Order Actions">
              <div className="grid gap-3">
                <ShipmentDetails order={order} />

                <Link
                  href={`/my-orders/${orderId}`}
                  className="rounded-full bg-black px-5 py-3 text-center text-sm font-black text-white"
                >
                  Tracking
                </Link>

                <Link
                  href={`/my-orders/${orderId}/invoice`}
                  className="rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-black text-black hover:border-black"
                >
                  Invoice
                </Link>

                <Link
                  href="/help-center"
                  className="rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-black text-black hover:border-black"
                >
                  Need Help
                </Link>

                {["Pending", "Processing"].includes(order.status) && (
                  <CancelOrderButton orderId={orderId as any} />
                )}

                {returnAvailable && (
                  <Link
                    href={`/my-orders/${orderId}/return`}
                    className="rounded-full border border-orange-200 bg-orange-50 px-5 py-3 text-center text-sm font-black text-orange-600"
                  >
                    Request Return
                  </Link>
                )}

                {order.status === "Delivered" && (
                  <Link
                    href={`/my-orders/${orderId}/review`}
                    className="rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-black text-black hover:border-black"
                  >
                    Write Review
                  </Link>
                )}

                <Link
                  href={items?.[0]?.product_id ? `/product/${items[0].product_id}` : "/"}
                  className="rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-black text-black hover:border-black"
                >
                  Buy Again
                </Link>
              </div>
            </LuxuryCard>

            <LuxuryCard title="Payment Info">
              <div className="space-y-3 text-sm font-semibold text-gray-600">
                <p>
                  Method:{" "}
                  <b className="text-black">{order.payment_method || "COD"}</b>
                </p>
                <p>
                  Payment Status:{" "}
                  <b className="text-black">
                    {order.payment_status || "Pending"}
                  </b>
                </p>
                <p>
                  Order Status:{" "}
                  <b className="text-black">{order.status || "Pending"}</b>
                </p>
              </div>
            </LuxuryCard>

            <LuxuryCard title="Price Details">
              <div className="space-y-3 text-sm">
                <PriceRow label="Subtotal" value={subtotal} />
                <PriceRow label="Discount" value={-discount} green />
                <PriceRow
                  label="Delivery Charges"
                  text={deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                  green={deliveryCharge === 0}
                />
                <PriceRow label="GST" value={gstAmount} />

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </LuxuryCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ShipmentDetails({ order }: { order: any }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="mb-4 text-lg font-black">Shipment Details</h3>

      <div className="grid gap-4">
        <div>
          <p className="text-xs font-bold text-gray-500">Courier</p>
          <p className="font-black">{order.courier_name || "Not Assigned"}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500">Tracking Number</p>
          <p className="break-all font-black">
            {order.tracking_number || "Pending"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500">Estimated Delivery</p>
          <p className="font-black">{order.delivery_estimate || "TBA"}</p>
        </div>
      </div>
    </div>
  );
}

function TrackingBar({
  status,
  activeIndex,
}: {
  status: string;
  activeIndex: number;
}) {
  if (status === "Cancelled") {
    return (
      <div className="mt-6 rounded-3xl bg-red-50 p-4 text-sm font-black text-red-600">
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="grid grid-cols-6 gap-2">
        {steps.map((step, index) => {
          const done = index <= activeIndex;

          return (
            <div key={step}>
              <div
                className={`h-2 rounded-full ${
                  done ? "bg-black" : "bg-gray-200"
                }`}
              />
              <p
                className={`mt-2 text-[10px] font-black md:text-xs ${
                  done ? "text-black" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LuxuryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:p-6">
      <h2 className="mb-5 text-xl font-black tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-black ${
        light ? "bg-gray-100 text-gray-700" : "bg-black text-white"
      }`}
    >
      {text}
    </span>
  );
}

function PriceRow({
  label,
  value,
  text,
  green = false,
}: {
  label: string;
  value?: number;
  text?: string;
  green?: boolean;
}) {
  return (
    <div className={`flex justify-between ${green ? "text-green-700" : ""}`}>
      <span className="font-semibold text-gray-500">{label}</span>
      <b>{text || `₹${Number(value || 0).toLocaleString("en-IN")}`}</b>
    </div>
  );
}