"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminEditProductForm({ product }: { product: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    image: product.image || "",
    category: product.category || "",
    sku: product.sku || "",
    status: product.status || "Pending Approval",
    featured: product.featured || false,
  });

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Product updated successfully");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <input className="input" placeholder="Product Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />

      <textarea className="input min-h-32" placeholder="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
        <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />
      </div>

      <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => updateField("image", e.target.value)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" placeholder="Category" value={form.category} onChange={(e) => updateField("category", e.target.value)} />
        <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} />
      </div>

      <select className="input" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
        <option>Pending Approval</option>
        <option>Approved</option>
        <option>Rejected</option>
        <option>Draft</option>
      </select>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => updateField("featured", e.target.checked)}
        />
        Featured Product
      </label>

      <button className="w-full bg-black text-white py-3 rounded-xl font-semibold">
        Update Product
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