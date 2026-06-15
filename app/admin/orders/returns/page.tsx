import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminOrderReturnActions from "@/components/admin/AdminOrderReturnActions";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  await connectDB();

  const orders = await Order.find({
    return_status: "Requested",
  })
    .sort({ return_requested_at: -1, updatedAt: -1 })
    .lean();

  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Return Requests
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <h2 className="font-bold text-xl">No return requests</h2>
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

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold h-fit">
                  Return Requested
                </span>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 my-4">
                <p className="text-sm font-bold text-yellow-800">Reason</p>
                <p className="text-sm text-gray-700">
                  {order.return_reason || "No reason provided"}
                </p>
              </div>

              <p className="font-bold mb-3">
                Refund Amount: ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
              </p>

              <AdminOrderReturnActions
                orderId={String(order._id)}
                amount={Number(order.total_amount || 0)}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}