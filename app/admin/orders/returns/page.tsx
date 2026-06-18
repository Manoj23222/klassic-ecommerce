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
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white shadow-xl md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Admin / Orders
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
          Return Management Center
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Review customer return requests, approve or reject returns, and manage
          refund status.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Pending Returns" value={orders.length} />
          <Stat
            title="Refund Pending"
            value={
              orders.filter((o: any) => o.refund_status === "Pending").length
            }
          />
          <Stat
            title="Total Refund Value"
            value={`₹${orders
              .reduce(
                (sum: number, o: any) =>
                  sum + Number(o.refund_amount || o.total_amount || 0),
                0
              )
              .toLocaleString("en-IN")}`}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">✅</div>
          <h2 className="mt-4 text-2xl font-black">No return requests</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            New customer return requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {orders.map((order: any) => {
            const orderId = String(order._id);
            const refundAmount = Number(
              order.refund_amount || order.total_amount || 0
            );

            return (
              <article
                key={orderId}
                className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      Order #{orderId.slice(-8).toUpperCase()}
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {order.customer_name || "Customer"}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-gray-500">
                      {order.phone || "No phone"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Badge text="Return Requested" />
                    <Badge text={order.refund_status || "Pending"} light />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Return Reason" value={order.return_reason} />
                  <InfoBox
                    label="Refund Amount"
                    value={`₹${refundAmount.toLocaleString("en-IN")}`}
                  />
                </div>

                {order.return_message && (
                  <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-700">
                      Customer Message
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      {order.return_message}
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  {(order.items || []).map((item: any, index: number) => (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex gap-3 rounded-2xl bg-gray-50 p-3"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.product_name || "Product"}
                        className="h-20 w-20 rounded-xl bg-white object-contain p-2"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-black">
                          {item.product_name || "Product"}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>

                        <p className="mt-1 text-sm font-black">
                          ₹
                          {Number(item.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4">
                  <AdminOrderReturnActions
                    orderId={orderId}
                    amount={refundAmount}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/45">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Badge({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black ${
        light
          ? "bg-gray-100 text-gray-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {text}
    </span>
  );
}

function InfoBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}