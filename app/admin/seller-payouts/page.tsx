import connectDB from "@/lib/mongodb";
import Payout from "@/models/Payout";
import Seller from "@/models/Seller";
import AdminPayoutAction from "@/components/admin/AdminPayoutAction";

export const dynamic = "force-dynamic";

export default async function SellerPayoutsPage() {
  await connectDB();

  const payouts = await Payout.find().sort({ createdAt: -1 }).lean();

  const sellers = await Seller.find({ status: "Approved" })
    .select(
      "store_name name email phone bank_name bank_account_holder bank_account_number bank_ifsc upi_id wallet_balance pending_payout total_sales"
    )
    .sort({ createdAt: -1 })
    .lean();

  const totalWallet = sellers.reduce(
    (sum: number, s: any) => sum + Number(s.wallet_balance || 0),
    0
  );

  const totalPending = sellers.reduce(
    (sum: number, s: any) => sum + Number(s.pending_payout || 0),
    0
  );

  const totalPaid = payouts
    .filter((p: any) => p.status === "Paid")
    .reduce((sum: number, p: any) => sum + Number(p.net_amount || 0), 0);

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Seller Payouts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage seller wallet, payout requests and settlement history.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card title="Total Wallet" value={`₹${totalWallet.toLocaleString("en-IN")}`} />
        <Card title="Pending Payout" value={`₹${totalPending.toLocaleString("en-IN")}`} />
        <Card title="Paid Payout" value={`₹${totalPaid.toLocaleString("en-IN")}`} />
        <Card title="Payout Requests" value={payouts.length} />
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Approved Sellers Wallet</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="bg-gray-950 text-white">
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Bank</th>
                <th className="p-3 text-left">UPI</th>
                <th className="p-3 text-left">Total Sales</th>
                <th className="p-3 text-left">Wallet</th>
                <th className="p-3 text-left">Pending Payout</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((s: any) => (
                <tr key={String(s._id)} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-bold">{s.store_name}</p>
                    <p className="text-xs text-gray-500">{s.email}</p>
                  </td>

                  <td className="p-3">
                    <p>{s.bank_name || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {s.bank_account_holder || ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      IFSC: {s.bank_ifsc || "N/A"}
                    </p>
                  </td>

                  <td className="p-3">{s.upi_id || "N/A"}</td>

                  <td className="p-3 font-bold">
                    ₹{Number(s.total_sales || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3 font-bold text-blue-600">
                    ₹{Number(s.wallet_balance || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3 font-bold text-yellow-600">
                    ₹{Number(s.pending_payout || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">Payout History</h2>

        {payouts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No payout records yet
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {payouts.map((p: any) => (
              <div
                key={String(p._id)}
                className="border rounded-2xl p-4 bg-gray-50"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{p.seller_store_name}</h3>
                    <p className="text-xs text-gray-500">
                      Payout ID: #{String(p._id).slice(-6)}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${
                      p.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <MiniCard title="Amount" value={`₹${Number(p.amount || 0).toLocaleString("en-IN")}`} />
                  <MiniCard title="Commission" value={`₹${Number(p.commission_amount || 0).toLocaleString("en-IN")}`} />
                  <MiniCard title="Net" value={`₹${Number(p.net_amount || 0).toLocaleString("en-IN")}`} />
                </div>

                {p.status !== "Paid" && (
                  <div className="mt-4">
                    <AdminPayoutAction payoutId={String(p._id)} />
                  </div>
                )}

                {p.transaction_id && (
                  <p className="text-xs text-gray-500 mt-3">
                    TXN: {p.transaction_id}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl sm:text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border rounded-xl p-2">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}