import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminRefundAction from "@/components/admin/AdminRefundAction";

export const dynamic = "force-dynamic";

export default async function RefundsPage() {
  await connectDB();

  const orders = await Order.find({
    refund_status: "Pending",
  })
    .sort({ return_action_at: -1, updatedAt: -1 })
    .lean();

  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Refund Requests
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <h2 className="font-bold text-xl">No pending refunds</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {orders.map((order: any) => (
            <div key={String(order._id)} className="bg-white rounded-2xl border shadow-sm p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-bold">#{String(order._id).slice(-6)}</h2>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold h-fit">
                  Refund Pending
                </span>
              </div>

              <p className="mt-4 font-bold">
                Amount: ₹{Number(order.refund_amount || order.total_amount || 0).toLocaleString("en-IN")}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Payment: {order.payment_method || "COD"}
              </p>

              <div className="mt-4">
                <AdminRefundAction
                  orderId={String(order._id)}
                  amount={Number(order.refund_amount || order.total_amount || 0)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}