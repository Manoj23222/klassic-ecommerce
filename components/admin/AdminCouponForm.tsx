"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminCouponForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    type: "fixed",
    value: "",
    min_order_amount: "",
    max_discount: "",
    usage_limit: "100",
    start_date: "",
    expiry_date: "",
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Coupon created successfully");
      setForm({
        code: "",
        title: "",
        description: "",
        type: "fixed",
        value: "",
        min_order_amount: "",
        max_discount: "",
        usage_limit: "100",
        start_date: "",
        expiry_date: "",
      });
      router.refresh();
    } else {
      toast.error(data.message || "Coupon create failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input className="input" placeholder="Coupon Code" value={form.code} onChange={(e) => update("code", e.target.value)} />

      <input className="input" placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} />

      <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select className="input" value={form.type} onChange={(e) => update("type", e.target.value)}>
          <option value="fixed">Fixed Amount</option>
          <option value="percent">Percentage</option>
        </select>

        <input className="input" type="number" placeholder="Discount Value" value={form.value} onChange={(e) => update("value", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input" type="number" placeholder="Min Order Amount" value={form.min_order_amount} onChange={(e) => update("min_order_amount", e.target.value)} />

        <input className="input" type="number" placeholder="Max Discount" value={form.max_discount} onChange={(e) => update("max_discount", e.target.value)} />

        <input className="input" type="number" placeholder="Usage Limit" value={form.usage_limit} onChange={(e) => update("usage_limit", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} />

        <input className="input" type="date" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} />
      </div>

      <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
        Add Coupon
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 14px;
          padding: 12px 14px;
          outline: none;
        }
      `}</style>
    </form>
  );
}