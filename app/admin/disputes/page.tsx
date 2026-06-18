import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  await connectDB();

  const orders = await Order.find({
    $or: [
      { status: "Return Requested" },
      { status: "Return Rejected" },
      { refund_status: "Rejected" },
      { return_status: "Requested" },
    ],
  })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Customers & Disputes
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Dispute Center
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Track customer disputes, rejected returns and refund issues.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Total Disputes" value={orders.length} />
          <Stat
            title="Return Requests"
            value={orders.filter((o: any) => o.return_status === "Requested").length}
          />
          <Stat
            title="Refund Rejected"
            value={orders.filter((o: any) => o.refund_status === "Rejected").length}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">✅</div>
          <h2 className="mt-4 text-2xl font-black">No disputes found</h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Customer disputes will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order: any) => {
            const orderId = String(order._id);

            return (
              <article
                key={orderId}
                className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge text={order.status || "Pending"} />
                    <Badge text={order.return_status || "None"} light />
                    <Badge text={order.refund_status || "None"} light />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Info title="Return Reason" value={order.return_reason || "-"} />
                  <Info title="Refund Note" value={order.refund_note || "-"} />
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
                        className="h-16 w-16 rounded-xl bg-white object-contain p-2"
                      />

                      <div>
                        <h3 className="line-clamp-2 text-sm font-black">
                          {item.product_name || "Product"}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                  ))}
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
        light ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"
      }`}
    >
      {text}
    </span>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className="mt-2 text-sm font-black text-gray-800">{value}</p>
    </div>
  );
}