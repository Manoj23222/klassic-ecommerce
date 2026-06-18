"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerReportsClient() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/reports?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      });
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Reports & Analytics</h1>
        <p className="text-gray-500">Sales, products and order performance.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card title="Total Sales" value={`₹${Number(data?.totalSales || 0).toLocaleString()}`} />
        <Card title="Total Orders" value={String(data?.totalOrders || 0)} />
        <Card title="Products Sold" value={String(data?.productsSold || 0)} />
        <Card title="Avg Order Value" value={`₹${Number(data?.avgOrderValue || 0).toLocaleString()}`} />
      </section>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Top Products</h2>

        <div className="space-y-3">
          {(data?.topProducts || []).map((item: any) => (
            <div key={item.name} className="rounded-2xl border p-4">
              <div className="flex justify-between gap-3">
                <p className="font-black">{item.name}</p>
                <p className="font-black text-green-700">
                  ₹{Number(item.sales || 0).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Sold: {item.quantity}
              </p>
            </div>
          ))}

          {!data?.topProducts?.length && (
            <p className="py-8 text-center font-bold text-gray-500">
              No report data found
            </p>
          )}
        </div>
      </section>
    </SellerCentralLayout>
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