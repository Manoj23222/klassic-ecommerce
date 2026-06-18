"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const fallback = {
  level: "New Seller",
  xp_points: 120,
  total_orders: 0,
  total_sales: 0,
  trust_score: 60,
};

export default function SellerLevelClient() {
  const [level, setLevel] = useState<any>(fallback);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/level?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.level) setLevel(data.level);
      });
  }, []);

  const xp = Number(level.xp_points || 0);
  const progress = Math.min(100, Math.round((xp / 1000) * 100));

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Seller Level</h1>
        <p className="text-gray-500">
          Grow your store with XP, trust score and achievements.
        </p>
      </div>

      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-sm font-bold text-blue-200">Current Level</p>
        <h2 className="mt-2 text-4xl font-black">{level.level}</h2>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm font-bold text-blue-100">
          {xp} / 1000 XP to next level
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Card title="XP Points" value={String(level.xp_points || 0)} />
        <Card title="Total Orders" value={String(level.total_orders || 0)} />
        <Card
          title="Total Sales"
          value={`₹${Number(level.total_sales || 0).toLocaleString()}`}
        />
        <Card title="Trust Score" value={`${level.trust_score || 60}%`} />
      </section>
    </SellerCentralLayout>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-gray-400">{title}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
    </div>
  );
}