"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerWalletClient() {
  const [seller, setSeller] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadWallet(sellerId: string) {
    const res = await fetch(`/api/seller/wallet?seller_id=${sellerId}`);
    const json = await res.json();

    if (json.success) {
      setData(json);
    }
  }

  useEffect(() => {
    const savedSeller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = savedSeller?._id || savedSeller?.id;

    setSeller(savedSeller);

    if (sellerId) {
      loadWallet(sellerId);
    }
  }, []);

  async function requestWithdraw() {
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/seller/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: sellerId,
        amount: Number(amount),
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (json.success) {
      toast.success("Withdraw request submitted");
      setAmount("");
      loadWallet(sellerId);
    } else {
      toast.error(json.message || "Withdraw failed");
    }
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Seller Wallet</h1>
        <p className="text-gray-500">
          Track wallet balance, payouts and withdraw requests.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card
          title="Wallet Balance"
          value={`₹${Number(data?.walletBalance || 0).toLocaleString()}`}
        />
        <Card
          title="Pending Withdraw"
          value={`₹${Number(data?.pendingWithdraw || 0).toLocaleString()}`}
        />
        <Card
          title="Total Transactions"
          value={String(data?.transactions?.length || 0)}
        />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Request Withdraw</h2>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold">
              Amount ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Enter amount"
            />
          </label>

          <button
            onClick={requestWithdraw}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-black text-white disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Withdraw Request"}
          </button>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black">Withdraw Requests</h2>

          <div className="space-y-3">
            {(data?.withdraws || []).map((item: any) => (
              <div key={item._id} className="rounded-2xl border bg-gray-50 p-4">
                <div className="flex justify-between gap-3">
                  <p className="font-black">
                    ₹{Number(item.amount || 0).toLocaleString()}
                  </p>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                    {item.status}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {!data?.withdraws?.length && (
              <div className="rounded-2xl border bg-gray-50 p-6 text-center font-bold text-gray-500">
                No withdraw requests found
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Wallet Transactions</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Balance After</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {(data?.transactions || []).map((tx: any) => (
                <tr key={tx._id} className="border-b">
                  <td className="p-3 font-black">{tx.type}</td>
                  <td className="p-3">
                    ₹{Number(tx.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-3 font-bold">
                    ₹{Number(tx.balance_after || 0).toLocaleString()}
                  </td>
                  <td className="p-3">{tx.status}</td>
                  <td className="p-3">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {!data?.transactions?.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center font-bold text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SellerCentralLayout>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-gray-400">
        {title}
      </p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}