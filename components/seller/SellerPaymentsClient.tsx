"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerPaymentsClient() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/payments?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      });
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Payments & Payouts</h1>
        <p className="text-gray-500">Track settlements, commission and payouts.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Available Payout" value={`₹${Number(data?.availablePayout || 0).toLocaleString()}`} />
        <Card title="Pending Settlement" value={`₹${Number(data?.pendingSettlement || 0).toLocaleString()}`} />
        <Card title="Total Commission" value={`₹${Number(data?.totalCommission || 0).toLocaleString()}`} />
      </section>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Settlement History</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Sale Amount</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Payout</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {(data?.settlements || []).map((item: any) => (
                <tr key={item.orderId} className="border-b">
                  <td className="p-3 font-black">#{String(item.orderId).slice(-6)}</td>
                  <td className="p-3">₹{Number(item.saleAmount || 0).toLocaleString()}</td>
                  <td className="p-3">₹{Number(item.commission || 0).toLocaleString()}</td>
                  <td className="p-3 font-black text-green-700">
                    ₹{Number(item.payout || 0).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!data?.settlements?.length && (
                <tr>
                  <td colSpan={5} className="p-10 text-center font-bold text-gray-500">
                    No settlements found
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
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}