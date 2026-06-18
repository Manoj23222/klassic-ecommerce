"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerPerformanceClient() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/performance?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      });
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Performance</h1>
        <p className="text-gray-500">Seller quality, fulfillment and account health.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Score title="Trust Score" value={data?.trustScore || 60} />
        <Score title="On-Time Shipping" value={data?.onTimeShipping || 90} />
        <Score title="Order Quality" value={data?.orderQuality || 95} />
        <Score title="Customer Rating" value={data?.customerRating || 85} />
      </section>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Account Health</h2>

        <div className="space-y-4">
          <Health title="Late Dispatch Rate" value={data?.lateDispatchRate || 0} limit="Target below 5%" />
          <Health title="Cancellation Rate" value={data?.cancellationRate || 0} limit="Target below 2%" />
          <Health title="Return Rate" value={data?.returnRate || 0} limit="Target below 10%" />
        </div>
      </section>
    </SellerCentralLayout>
  );
}

function Score({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className="mt-3 text-4xl font-black">{value}%</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-green-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Health({ title, value, limit }: { title: string; value: number; limit: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex justify-between gap-3">
        <p className="font-black">{title}</p>
        <p className="font-black">{value}%</p>
      </div>
      <p className="mt-1 text-sm text-gray-500">{limit}</p>
    </div>
  );
}