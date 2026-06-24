"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminFlashSaleForm({
  products,
}: {
  products: any[];
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    product_ids: [] as string[],
    discount_percent: "",
    start_date: "",
    end_date: "",
    active: true,
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(id)
        ? prev.product_ids.filter((x) => x !== id)
        : [...prev.product_ids, id],
    }));
  };

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("FLASH FORM =", form);

  const res = await fetch("/api/admin/flash-sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  console.log("FLASH API STATUS =", res.status);
  console.log("FLASH API RESPONSE =", data);

  if (data.success) {
    toast.success("Flash sale created");
    setForm({
      title: "",
      product_ids: [],
      discount_percent: "",
      start_date: "",
      end_date: "",
      active: true,
    });
    router.refresh();
  } else {
    toast.error(data.message || "Create failed");
  }
};

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className="input"
        placeholder="Flash Sale Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Discount %"
        value={form.discount_percent}
        onChange={(e) => update("discount_percent", e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input"
          type="datetime-local"
          value={form.start_date}
          onChange={(e) => update("start_date", e.target.value)}
        />

        <input
          className="input"
          type="datetime-local"
          value={form.end_date}
          onChange={(e) => update("end_date", e.target.value)}
        />
      </div>

      <div className="border rounded-2xl p-4 max-h-80 overflow-y-auto">
        <h3 className="font-bold mb-3">Select Products</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((product) => (
            <label
              key={product.id}
              className="flex gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={form.product_ids.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
              />

              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-12 h-12 object-contain border rounded-lg bg-white"
              />

              <div>
                <p className="font-semibold text-sm line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => update("active", e.target.checked)}
        />
        Active Flash Sale
      </label>

      <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
        Create Flash Sale
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