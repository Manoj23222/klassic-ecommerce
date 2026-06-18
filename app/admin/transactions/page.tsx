import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Payout from "@/models/Payout";
import WithdrawRequest from "@/models/WithdrawRequest";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  await connectDB();

  const [orders, payouts, withdraws] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(50).lean(),
    Payout.find().sort({ createdAt: -1 }).limit(50).lean(),
    WithdrawRequest.find().sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  const orderTotal = orders.reduce(
    (sum: number, order: any) => sum + Number(order.total_amount || 0),
    0
  );

  const payoutTotal = payouts.reduce(
    (sum: number, payout: any) => sum + Number(payout.amount || payout.net_amount || 0),
    0
  );

  const withdrawTotal = withdraws.reduce(
    (sum: number, w: any) => sum + Number(w.amount || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-6">
      <div className="mb-8 rounded-[2rem] bg-black p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
          Financials
        </p>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">
          Transactions
        </h1>

        <p className="mt-2 text-sm font-semibold text-white/60">
          Track order payments, seller payouts and withdrawal activity.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat title="Order Payments" value={`₹${orderTotal.toLocaleString("en-IN")}`} />
          <Stat title="Payouts" value={`₹${payoutTotal.toLocaleString("en-IN")}`} />
          <Stat title="Withdrawals" value={`₹${withdrawTotal.toLocaleString("en-IN")}`} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <TransactionCard title="Latest Order Payments" items={orders} type="order" />
        <TransactionCard title="Seller Payouts" items={payouts} type="payout" />
        <TransactionCard title="Withdraw Requests" items={withdraws} type="withdraw" />
      </div>
    </main>
  );
}

function TransactionCard({
  title,
  items,
  type,
}: {
  title: string;
  items: any[];
  type: "order" | "payout" | "withdraw";
}) {
  return (
    <section className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-5 text-center text-sm font-semibold text-gray-500">
            No transactions found
          </p>
        ) : (
          items.map((item: any) => {
            const id = String(item._id);
            const amount =
              type === "order"
                ? Number(item.total_amount || 0)
                : Number(item.amount || item.net_amount || 0);

            const status =
              type === "order"
                ? item.payment_status || item.status
                : item.status || "Pending";

            return (
              <div key={id} className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      #{id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {type === "order"
                        ? item.customer_name || "Customer"
                        : item.seller_store_name || item.seller_name || "Seller"}
                    </p>
                  </div>

                  <Badge text={status} />
                </div>

                <p className="mt-3 text-xl font-black">
                  ₹{amount.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
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

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
      {text}
    </span>
  );
}