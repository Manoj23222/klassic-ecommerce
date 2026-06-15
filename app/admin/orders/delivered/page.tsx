import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DeliveredOrdersPage() {
  await connectDB();

  const orders = await Order.find({ status: "Delivered" })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Delivered Orders
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {orders.map((order: any) => (
          <div key={String(order._id)} className="bg-white rounded-2xl border shadow-sm p-4">
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-bold">#{String(order._id).slice(-6)}</h2>
                <p className="text-sm text-gray-500">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.phone}</p>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold h-fit">
                Delivered
              </span>
            </div>

            <p className="mt-3 font-bold">
              ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Payment: {order.payment_method || "COD"}
            </p>

            <div className="mt-4 space-y-2">
              {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-2">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.product_name}
                    className="w-12 h-12 rounded-lg object-contain bg-white border"
                  />
                  <div>
                    <p className="text-sm font-semibold line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/admin/orders/${String(order._id)}`}
              className="block text-center mt-4 bg-gray-900 text-white py-2 rounded-xl font-bold"
            >
              View Order
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}