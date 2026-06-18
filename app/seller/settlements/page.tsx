import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";
import Payout from "@/models/Payout";
import WithdrawRequest from "@/models/WithdrawRequest";
import WalletTransaction from "@/models/WalletTransaction";

export const dynamic = "force-dynamic";

export default async function SellerSettlementsPage() {
  await connectDB();

  const cookieStore = await cookies();

  const sellerId =
    cookieStore.get("seller_id")?.value ||
    cookieStore.get("user_id")?.value;

  if (!sellerId) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-black">Please login first</h1>
      </main>
    );
  }

  const payouts = await Payout.find({ seller_id: sellerId })
    .sort({ createdAt: -1 })
    .lean();

  const withdrawals = await WithdrawRequest.find({ seller_id: sellerId })
    .sort({ createdAt: -1 })
    .lean();

  const transactions = await WalletTransaction.find({ seller_id: sellerId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const clean = (items: any[]) =>
    items.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() || "",
      updatedAt: item.updatedAt?.toISOString?.() || "",
    }));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black">Settlement History</h1>
          <p className="text-gray-500">
            Track payouts, withdraw requests, and wallet transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SummaryCard title="Total Payouts" value={payouts.length} />
          <SummaryCard title="Withdraw Requests" value={withdrawals.length} />
          <SummaryCard title="Transactions" value={transactions.length} />
        </div>

        <SettlementTable title="Payout History" items={clean(payouts)} />
        <SettlementTable title="Withdraw History" items={clean(withdrawals)} />
        <SettlementTable title="Wallet Transactions" items={clean(transactions)} />
      </section>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-gray-500 font-bold">{title}</p>
      <h2 className="text-3xl font-black mt-2">{value}</h2>
    </div>
  );
}

function SettlementTable({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-xl font-black">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Note</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-4 font-bold">
                  {item.type || item.method || "Settlement"}
                </td>

                <td className="p-4 font-black text-green-700">
                  ₹{Number(item.amount || item.net_amount || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100">
                    {item.status || "Pending"}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td className="p-4 text-gray-500">
                  {item.description || item.note || "-"}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}