import CancelOrderButton from "@/components/CancelOrderButton";
import Header from "@/components/Header";
import db from "@/lib/db";
import Link from "next/link";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

function getStatusIndex(status: string) {
  if (status === "Cancelled") return -1;
  const index = steps.indexOf(status);
  return index >= 0 ? index : 0;
}

export default async function MyOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [orders]: any = await db.query("SELECT * FROM orders WHERE id = ?", [
    id,
  ]);

  const [items]: any = await db.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [id]
  );

  if (orders.length === 0) {
    return <h1 className="p-10 text-3xl">Order not found</h1>;
  }

  const order = orders[0];
  const currentStep = getStatusIndex(order.status);

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const discount = Number(order.discount || 0);
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const finalTotal = Number(order.total_amount || subtotal - discount + deliveryCharge);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <Link
          href="/my-orders"
          className="inline-flex bg-gray-900 text-white px-4 py-2 rounded-xl mb-6"
        >
          ← Back to My Orders
        </Link>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-500 mt-2">
                Placed on{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <span
                className={`inline-block px-5 py-2 rounded-full font-bold ${
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
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-2xl font-bold mb-6">🚚 Order Tracking</h2>

  <div className="relative border-l-4 border-green-500 ml-4 space-y-10">
    {[
      {
        title: "Order Confirmed",
        desc: "Your order has been placed.",
        sub: "Seller has received your order.",
      },
      {
        title: "Processing",
        desc: "Seller is preparing your item.",
        sub: "Your item is being packed.",
      },
      {
        title: "Shipped",
        desc: "Your item has been shipped.",
        sub: "Your item is on the way.",
      },
      {
        title: "Out For Delivery",
        desc: "Your item is out for delivery.",
        sub: "Delivery partner will reach you soon.",
      },
      {
        title: "Delivered",
        desc: "Your item has been delivered.",
        sub: "Thank you for shopping with Klassic.",
      },
    ].map((step, index) => (
      <div key={step.title} className="relative pl-8">
        <div
          className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 border-white ${
            index <= currentStep ? "bg-green-600" : "bg-gray-300"
          }`}
        />

        <h3 className="text-2xl font-bold">
          {step.title}
          <span className="text-gray-400 text-lg ml-2">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : ""}
          </span>
        </h3>

        <p className="text-lg mt-3">{step.desc}</p>
        <p className="text-gray-500 mt-1">{step.sub}</p>
      </div>
    ))}
  </div>
</div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-5">🛍️ Ordered Items</h2>

            <div className="space-y-4">
              {items.map((item: any) => {
                const itemTotal =
                  Number(item.price) * Number(item.quantity);

                return (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-4 flex flex-col md:flex-row md:justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-lg">
                        {item.product_name}
                      </h3>

                      {item.color && (
                        <p className="text-sm text-gray-600">
                          Color: <b>{item.color}</b>
                        </p>
                      )}

                      {item.size && (
                        <p className="text-sm text-gray-600">
                          Size: <b>{item.size}</b>
                        </p>
                      )}

                      <p className="text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500">Item Price</p>
                      <p className="font-bold text-green-600">
                        ₹{Number(item.price).toFixed(2)}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        Item Total
                      </p>
                      <p className="font-bold">₹{itemTotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">👤 Delivery Details</h2>
              <p>
                <b>Name:</b> {order.customer_name || "N/A"}
              </p>
              <p>
                <b>Phone:</b> {order.phone || "N/A"}
              </p>
              <p>
                <b>Address:</b> {order.address || "N/A"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">💳 Price Details</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b>₹{subtotal.toFixed(2)}</b>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <b className="text-green-600">- ₹{discount.toFixed(2)}</b>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <b
                    className={
                      deliveryCharge === 0
                        ? "text-green-600"
                        : "text-gray-900"
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(2)}`}
                  </b>
                </div>

                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <b>{order.payment_method || "COD"}</b>
                </div>

                <div className="flex justify-between">
                  <span>Coupon</span>
                  <b>{order.coupon_code || "No Coupon"}</b>
                </div>

                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <b className="text-green-600">
                    ₹{finalTotal.toFixed(2)}
                  </b>
                </div>
              </div>
            </div>

            {order.status === "Pending" && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-4 text-red-600">
                  Order Actions
                </h2>

                <CancelOrderButton orderId={order.id} />
              </div>
            )}

            <Link
              href={`/admin/orders/${order.id}/invoice`}
              className="block text-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700"
            >
              Download Invoice
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}