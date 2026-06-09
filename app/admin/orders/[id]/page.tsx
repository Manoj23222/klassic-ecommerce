import UpdateOrderStatus from "@/components/UpdateOrderStatus";
import db from "@/lib/db";
import Link from "next/link";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

export default async function OrderDetailsPage({
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
  const currentStep = steps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/orders"
          className="inline-flex bg-gray-900 text-white px-4 py-2 rounded-lg mb-5"
        >
          ← Back to Orders
        </Link>

        <h1 className="text-4xl font-bold mb-6">Order #{order.id}</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>

              <div className="grid grid-cols-4 gap-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={
                      index <= currentStep
                        ? "bg-green-100 text-green-700 p-3 rounded-lg text-center font-bold"
                        : "bg-gray-100 text-gray-500 p-3 rounded-lg text-center"
                    }
                  >
                    {index <= currentStep ? "✅ " : "○ "}
                    {step}
                  </div>
                ))}
              </div>

              {order.status === "Cancelled" && (
                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg font-bold">
                  This order has been cancelled.
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4">Items</h2>

              <div className="space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-4"
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

<p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ₹{Number(item.price) * Number(item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>

              <div className="space-y-2 text-gray-700">
                <p><b>Name:</b> {order.customer_name || "N/A"}</p>
                <p><b>Phone:</b> {order.phone || "N/A"}</p>
                <p><b>Address:</b> {order.address || "N/A"}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

              <div className="space-y-2">
                <p><b>Status:</b> {order.status}</p>
                <p><b>Payment:</b> {order.payment_method || "COD"}</p>
                <p><b>Coupon:</b> {order.coupon_code || "No Coupon"}</p>
                <p><b>Discount:</b> ₹{order.discount || 0}</p>

                <div className="border-t pt-3 mt-3">
                  <p className="text-2xl font-bold text-green-600">
                    Total: ₹{order.total_amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Update Status</h2>

              <UpdateOrderStatus
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>

            <Link
              href={`/admin/orders/${order.id}/invoice`}
              className="block text-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold"
            >
              Download Invoice
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}