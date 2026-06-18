"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminSellerPayouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(false);

  async function loadPayouts() {
    const res = await fetch("/api/admin/seller-payouts");
    const data = await res.json();

    if (data.success) {
      setPayouts(data.payouts || []);
      setSummary(data.summary || {});
    }
  }

  useEffect(() => {
    loadPayouts();
  }, []);

  async function approvePayout(payoutId: string, markPaid = false) {
    setLoading(true);

    const res = await fetch("/api/admin/seller-payouts/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payout_id: payoutId,
        mark_paid: markPaid,
        transaction_id: markPaid ? `TXN-${Date.now()}` : "",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success(markPaid ? "Payout paid" : "Payout approved");
      loadPayouts();
    } else {
      toast.error(data.message || "Action failed");
    }
  }

  async function generatePayouts() {
    setLoading(true);

    const res = await fetch("/api/admin/seller-payouts/generate", {
      method: "POST",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success(`${data.createdCount || 0} payouts generated`);
      loadPayouts();
    } else {
      toast.error(data.message || "Generate failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white">
          <h1 className="text-3xl font-black">Seller Payouts</h1>
          <p className="mt-2 text-sm text-gray-300">
            Approve and track seller settlements.
          </p>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Card title="Total Payouts" value={String(summary.totalPayouts || 0)} />
          <Card
            title="Pending Amount"
            value={`₹${Number(summary.totalPending || 0).toLocaleString()}`}
          />
          <Card
            title="Paid Amount"
            value={`₹${Number(summary.totalPaid || 0).toLocaleString()}`}
          />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-black">Payout Requests</h2>

            <button
              onClick={generatePayouts}
              disabled={loading}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              Generate Payouts
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Seller</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Sale</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Payout</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout._id} className="border-b">
                    <td className="p-3 font-bold">
                      {payout.seller_store_name || payout.seller_id}
                    </td>

                    <td className="p-3">
                      #{String(payout.order_id).slice(-6)}
                    </td>

                    <td className="p-3">
                      ₹{Number(payout.sale_amount || 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      ₹{Number(payout.commission_amount || 0).toLocaleString()}
                    </td>

                    <td className="p-3 font-black text-green-700">
                      ₹{Number(payout.payout_amount || 0).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                        {payout.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          disabled={loading || payout.status !== "Pending"}
                          onClick={() => approvePayout(payout._id, false)}
                          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white disabled:opacity-40"
                        >
                          Approve
                        </button>

                        <button
                          disabled={loading || payout.status === "Paid"}
                          onClick={() => approvePayout(payout._id, true)}
                          className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white disabled:opacity-40"
                        >
                          Mark Paid
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {payouts.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center font-bold text-gray-500"
                    >
                      No payout requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}