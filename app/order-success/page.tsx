import Header from "@/components/Header";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  let order: any = null;

  if (orderId) {
    await connectDB();
    order = await Order.findById(orderId).lean();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-white p-6 text-center shadow md:p-10">
          <div className="text-6xl">✅</div>

          <h1 className="mt-4 text-3xl font-black text-green-600 md:text-4xl">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for shopping with Klassic.
          </p>

          {orderId && (
            <p className="mt-4 font-black text-slate-900">
              Order ID: #{orderId}
            </p>
          )}
        </div>

        {order && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="rounded-3xl bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-black">Order Items</h2>

              <div className="space-y-4">
                {(order.items || []).map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="h-20 w-20 rounded-xl bg-gray-100 object-contain"
                    />

                    <div className="flex-1">
                      <h3 className="font-black">{item.product_name}</h3>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity || 1}
                      </p>

                      {item.color && (
                        <p className="text-sm text-gray-500">
                          Color: {item.color}
                        </p>
                      )}

                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="mt-1 font-black text-green-600">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                        {item.item_status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl bg-white p-5 shadow">
                <h2 className="mb-3 text-xl font-black">Delivery Address</h2>

                <p className="font-black">{order.customer_name}</p>
                <p className="text-sm">{order.phone}</p>
                <p className="mt-2 text-sm text-gray-600">{order.address}</p>

                {(order.city || order.state || order.pincode) && (
                  <p className="mt-1 text-sm text-gray-600">
                    {[order.city, order.state, order.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {order.landmark && (
                  <p className="mt-1 text-sm text-gray-600">
                    Landmark: {order.landmark}
                  </p>
                )}

                <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {order.address_type || "Home"}
                </span>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow">
                <h2 className="mb-3 text-xl font-black">Payment Summary</h2>

                <Row label="Subtotal" value={order.subtotal} />
                <Row label="Discount" value={-Number(order.discount || 0)} green />
                <Row label="Delivery" value={order.delivery_charge || 0} />
                <Row label="GST" value={order.gst_amount || 0} />

                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>₹{Number(order.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <p className="mt-3 text-sm">
                  Payment: <b>{order.payment_method}</b>
                </p>

                <p className="text-sm">
                  Status: <b>{order.payment_status}</b>
                </p>
              </div>

              <div className="grid gap-3">
                <Link
                  href={`/account/orders`}
                  className="rounded-2xl bg-green-600 px-6 py-3 text-center font-black text-white"
                >
                  Track Order
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl bg-slate-950 px-6 py-3 text-center font-black text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
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
    <div className={`flex justify-between text-sm ${green ? "text-green-600" : ""}`}>
      <span>{label}</span>
      <b>₹{Number(value || 0).toFixed(2)}</b>
    </div>
  );
}