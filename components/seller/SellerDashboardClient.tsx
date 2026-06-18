"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

type DashboardData = {
  stats: {
    todaySales: number;
    pendingOrders: number;
    lowStock: number;
    pendingProducts: number;
    totalProducts: number;
    totalOrders: number;
  };
  recentOrders: any[];
  lowStockProducts: any[];
};

export default function SellerDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const savedSeller = JSON.parse(localStorage.getItem("seller") || "{}");
    setSeller(savedSeller);

    const sellerId = savedSeller?._id || savedSeller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/dashboard?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      });
  }, []);

  const stats = data?.stats;

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black md:text-4xl">
          Welcome back, {seller?.store_name || seller?.storeName || "Seller"}!
        </h1>
        <p className="mt-1 font-semibold text-gray-500">
          Here is your business overview for today.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Kpi
          title="Today's Sales"
          value={`₹${Number(stats?.todaySales || 0).toLocaleString()}`}
          note="Live seller sales"
        />
        <Kpi
          title="Pending Orders"
          value={String(stats?.pendingOrders || 0)}
          note="Need processing"
        />
        <Kpi
          title="Low Stock Alert"
          value={String(stats?.lowStock || 0)}
          note="Restock now"
        />
        <Kpi
          title="Total Products"
          value={String(stats?.totalProducts || 0)}
          note={`${stats?.pendingProducts || 0} pending approval`}
        />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Sales Trend</h2>
          <p className="text-sm font-semibold text-gray-500">Last 7 days</p>

          <div className="mt-6 flex h-64 items-end gap-4 border-b border-l p-4">
            {[35, 55, 42, 70, 62, 88, 76].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-blue-600"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs font-black text-gray-500">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Action Required</h2>

          <div className="mt-4 space-y-3">
            <Action text={`Pack ${stats?.pendingOrders || 0} Orders`} />
            <Action text={`Update ${stats?.lowStock || 0} Low Stock SKUs`} />
            <Action text={`${stats?.pendingProducts || 0} Products Pending Approval`} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {(data?.recentOrders || []).map((order) => (
                <Row
                  key={order._id}
                  id={`#${String(order._id).slice(-6).toUpperCase()}`}
                  product={order.items?.[0]?.product_name || "Order Items"}
                  amount={`₹${Number(order.amount || 0).toLocaleString()}`}
                  status={order.status || "Pending"}
                  action={order.status === "Delivered" ? "Invoice" : "Pack"}
                />
              ))}

              {!data?.recentOrders?.length && (
                <tr>
                  <td colSpan={5} className="p-6 text-center font-bold text-gray-500">
                    No recent orders found
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

function Kpi({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm md:rounded-3xl md:p-5">
      <p className="line-clamp-1 text-[10px] font-black uppercase tracking-widest text-gray-400 md:text-xs">
        {title}
      </p>
      <p className="mt-2 text-2xl font-black md:mt-3 md:text-3xl">
        {value}
      </p>
      <p className="mt-1 line-clamp-1 text-xs font-bold text-green-600 md:mt-2 md:text-sm">
        {note}
      </p>
    </div>
  );
}

function Action({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border bg-orange-50 p-4 font-black text-orange-700">
      ⚠️ {text}
    </div>
  );
}

function Row({
  id,
  product,
  amount,
  status,
  action,
}: {
  id: string;
  product: string;
  amount: string;
  status: string;
  action: string;
}) {
  return (
    <tr className="border-b">
      <td className="p-3 font-black">{id}</td>
      <td className="p-3">{product}</td>
      <td className="p-3 font-bold">{amount}</td>
      <td className="p-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          {status}
        </span>
      </td>
      <td className="p-3">
        <button className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white">
          {action}
        </button>
      </td>
    </tr>
  );
}