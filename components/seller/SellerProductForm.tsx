"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerProductForm({ sellerId }: { sellerId: number }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "General",
    colors: "",
    sizes: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/seller/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        seller_id: sellerId,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Product added successfully");
      router.push("/seller/products");
    } else {
      alert(data.message || "Product add failed");
    }
  };

  return (
    <form onSubmit={addProduct} className="mt-6 grid md:grid-cols-2 gap-4">
      <input
        className="border p-3 rounded-xl"
        placeholder="Product Name *"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-xl"
        placeholder="Price *"
        type="number"
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-xl"
        placeholder="Stock *"
        type="number"
        value={form.stock}
        onChange={(e) => updateField("stock", e.target.value)}
        required
      />

      <select
        className="border p-3 rounded-xl"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      >
        <option value="General">General</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home & Kitchen">Home & Kitchen</option>
        <option value="Grocery">Grocery</option>
        <option value="Sports">Sports</option>
      </select>

      <input
        className="border p-3 rounded-xl md:col-span-2"
        placeholder="Image URL *"
        value={form.image}
        onChange={(e) => updateField("image", e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-xl"
        placeholder="Colors comma separated e.g. Red,Blue"
        value={form.colors}
        onChange={(e) => updateField("colors", e.target.value)}
      />

      <input
        className="border p-3 rounded-xl"
        placeholder="Sizes comma separated e.g. S,M,L"
        value={form.sizes}
        onChange={(e) => updateField("sizes", e.target.value)}
      />

      <textarea
        className="border p-3 rounded-xl md:col-span-2"
        placeholder="Product Description *"
        rows={5}
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="md:col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}