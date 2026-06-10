import CancelOrderButton from "@/components/CancelOrderButton";
import Header from "@/components/Header";
import ReviewForm from "@/components/ReviewForm";
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
    return <h1 className="p-10 text-2xl font-bold">Order not found</h1>;
  }

  const order = orders[0];
  const currentStep = getStatusIndex(order.status || "Pending");

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const discount = Number(order.discount || 0);
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const finalTotal = Number(
    order.total_amount || subtotal - discount + deliveryCharge
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          ›{" "}
          <Link href="/my-orders" className="hover:text-blue-600">
            My Orders
          </Link>{" "}
          › Order #{order.id}
        </div>

        <div className="grid lg:grid-cols-[1fr_330px] gap-4">
          <div className="space-y-4">
            <div className="bg-white border rounded shadow-sm p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-lg md:text-xl font-bold">
                    Order #{order.id}
                  </h1>

                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="bg-white border rounded shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold mb-5">
                Order Tracking
              </h2>

              {order.status === "Cancelled" ? (
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full mt-2" />
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-red-600">
                      Order Cancelled
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your order has been cancelled.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative ml-2 border-l-2 border-gray-200 space-y-7">
                  {steps.map((step, index) => {
                    const active = index <= currentStep;

                    return (
                      <div key={step} className="relative pl-6">
                        <span
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                            active ? "bg-green-600" : "bg-gray-300"
                          }`}
                        />

                        <h3
                          className={`text-sm md:text-base font-bold ${
                            active ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </h3>

                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {step === "Pending" &&
                            "Your order has been placed."}
                          {step === "Processing" &&
                            "Seller is preparing your item."}
                          {step === "Shipped" &&
                            "Your item is on the way."}
                          {step === "Delivered" &&
                            "Your item has been delivered."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border rounded shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold mb-4">
                Ordered Items
              </h2>

              <div className="space-y-3">
                {items.map((item: any) => {
                  const itemTotal =
                    Number(item.price) * Number(item.quantity);

                  return (
                    <div
                      key={item.id}
                      className="border rounded p-3 md:p-4"
                    >
                      <div className="grid md:grid-cols-[1fr_120px] gap-3">
                        <div>
                          <h3 className="text-sm md:text-base font-semibold line-clamp-2">
                            {item.product_name}
                          </h3>

                          <div className="flex flex-wrap gap-3 mt-2 text-xs md:text-sm text-gray-500">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-sm font-bold text-gray-900">
                            ₹{itemTotal.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {order.status === "Delivered" && item.product_id && (
                        <ReviewForm
                          productId={Number(item.product_id)}
                          orderId={Number(order.id)}
                          defaultName={order.customer_name || ""}
                        />
                      )}

                      {order.status !== "Delivered" && (
                        <p className="text-xs text-gray-500 mt-3">
                          Review option will unlock after delivery.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border rounded shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold mb-3">
                Delivery Address
              </h2>

              <p className="text-sm font-bold">
                {order.customer_name || "N/A"}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                {order.address || "N/A"}
              </p>
              <p className="text-sm mt-2">
                <b>Phone:</b> {order.phone || "N/A"}
              </p>
            </div>

            <div className="bg-white border rounded shadow-sm p-4 md:p-5">
              <h2 className="text-base md:text-lg font-bold mb-3">
                Price Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -₹{discount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Payment</span>
                  <span>{order.payment_method || "COD"}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.status === "Pending" && (
              <div className="bg-white border rounded shadow-sm p-4 md:p-5">
                <h2 className="text-base font-bold mb-3 text-red-600">
                  Order Actions
                </h2>
                <CancelOrderButton orderId={order.id} />
              </div>
            )}

           <Link
  href={`/my-orders/${order.id}/invoice`}
  className="block text-center bg-green-600 text-white px-4 py-3 rounded font-semibold text-sm hover:bg-green-700"
>
  Download Invoice
</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}