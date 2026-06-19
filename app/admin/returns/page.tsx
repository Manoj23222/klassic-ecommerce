import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminReturnActions from "@/components/admin/AdminReturnActions";

export const dynamic = "force-dynamic";

export default async function AdminReturnsPage() {
  await connectDB();

  const orders = await Order.find({
    return_status: { $in: ["Requested", "Approved", "Rejected"] },
  })
    .sort({ updatedAt: -1 })
    .lean();

  const safeOrders = orders.map((order: any) => ({
    _id: String(order._id),
    customer_name: order.customer_name,
    phone: order.phone,
    address: order.address,
    total_amount: order.total_amount || 0,
    status: order.status,
    return_reason: order.return_reason || "",
    return_status: order.return_status || "None",
    refund_status: order.refund_status || "None",
    refund_amount: order.refund_amount || 0,
    payment_status: order.payment_status || "Pending",
    createdAt: order.createdAt ? order.createdAt.toISOString() : "",
    updatedAt: order.updatedAt ? order.updatedAt.toISOString() : "",
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          seller_store_name: item.seller_store_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          item_status: item.item_status,
        }))
      : [],
  }));

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            Admin Operations
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Returns & Refunds
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Approve returns, reject requests, and complete refunds.
          </p>
        </div>

        <div className="space-y-4">
          {safeOrders.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-black">
                No return requests found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Customer return requests will appear here.
              </p>
            </div>
          ) : (
            safeOrders.map((order: any) => (
              <div
                key={order._id}
                className="rounded-3xl bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-lg font-black">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.customer_name} • {order.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black">
                      ₹{Number(order.total_amount || 0).toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Refund: {order.refund_status}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-3">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-2xl border p-3"
                      >
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.product_name}
                          className="h-16 w-16 rounded-xl object-contain"
                        />

                        <div>
                          <p className="font-bold">{item.product_name}</p>
                          <p className="text-xs text-gray-500">
                            Seller: {item.seller_store_name || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} • ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-2xl bg-gray-50 p-4 text-sm">
                      <p className="font-black">Return Reason</p>
                      <p className="mt-1 text-gray-700">
                        {order.return_reason || "No reason provided"}
                      </p>
                    </div>
                  </div>

                  <AdminReturnActions order={order} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}