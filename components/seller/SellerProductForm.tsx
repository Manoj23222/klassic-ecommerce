"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const categoryMap: Record<string, string[]> = {
  Fashion: [
    "Men's Clothing",
    "Women's Clothing",
    "Kids Clothing",
    "Shoes",
    "Bags",
    "Watches",
    "Jewelry",
  ],
  Electronics: [
    "Mobile Phones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Smart Watches",
    "Accessories",
  ],
  "Home & Kitchen": [
    "Furniture",
    "Home Decor",
    "Kitchen Tools",
    "Storage & Organization",
    "Lighting",
  ],
  "Beauty & Personal Care": [
    "Skincare",
    "Hair Care",
    "Makeup",
    "Perfumes",
    "Grooming",
  ],
  Grocery: [
    "Fruits & Vegetables",
    "Snacks",
    "Beverages",
    "Dairy Products",
    "Organic Foods",
  ],
  "Sports & Fitness": [
    "Gym Equipment",
    "Yoga Accessories",
    "Outdoor Sports",
    "Cycling",
  ],
  "Toys & Games": [
    "Action Figures",
    "Educational Toys",
    "Board Games",
    "Remote Control Toys",
  ],
  "Books & Stationery": [
    "Books",
    "Notebooks",
    "Pens & Pencils",
    "Office Supplies",
  ],
  Automotive: ["Car Accessories", "Bike Accessories", "Tyres", "Car Care"],
  "Pet Supplies": ["Dog Food", "Cat Food", "Pet Toys", "Pet Accessories"],
};

const mainCategories = Object.keys(categoryMap);

function makeSku(name: string, category: string) {
  const namePart =
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "PROD";

  const categoryPart =
    category
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3) || "CAT";

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `KLS-${categoryPart}-${namePart}-${randomPart}`;
}

export default function SellerProductForm({
  sellerId,
}: {
  sellerId: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "Fashion",
    sub_category: "Men's Clothing",
    sku: "",
    colors: "",
    sizes: "",
  });

  const [loading, setLoading] = useState(false);

  const subCategories = useMemo(() => {
    return categoryMap[form.category] || [];
  }, [form.category]);

  const updateField = (key: string, value: string) => {
    setForm((prev) => {
      if (key === "category") {
        return {
          ...prev,
          category: value,
          sub_category: categoryMap[value]?.[0] || "",
        };
      }

      return { ...prev, [key]: value };
    });
  };

  const generateSku = () => {
    const sku = makeSku(form.name, form.category);
    setForm((prev) => ({ ...prev, sku }));
    toast.success("SKU generated");
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name.trim().length < 2) return toast.error("Enter product name");
    if (!form.category) return toast.error("Select main category");
    if (!form.sub_category) return toast.error("Select sub category");
    if (form.description.trim().length < 5)
      return toast.error("Enter product description");
    if (!form.price || Number(form.price) <= 0)
      return toast.error("Enter valid price");
    if (!form.stock || Number(form.stock) < 0)
      return toast.error("Enter valid stock");
    if (!form.sku.trim()) return toast.error("Generate or enter SKU");
    if (!form.image.trim()) return toast.error("Enter product image URL");

    try {
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

      if (data.success) {
        toast.success("Product submitted for approval");

        setTimeout(() => {
          router.push("/seller/products");
        }, 1200);
      } else {
        toast.error(data.message || "Product add failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={addProduct}
      className="mt-6 grid md:grid-cols-2 gap-4 bg-white p-5 md:p-6 rounded-2xl shadow border border-gray-100"
    >
      <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border p-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          Add Seller Product
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Amazon/Flipkart style product listing with category, sub category and SKU.
        </p>
      </div>

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Product Name *"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Price *"
        type="number"
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
        required
      />

      <select
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
        required
      >
        {mainCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white"
        value={form.sub_category}
        onChange={(e) => updateField("sub_category", e.target.value)}
        required
      >
        {subCategories.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Stock *"
        type="number"
        value={form.stock}
        onChange={(e) => updateField("stock", e.target.value)}
        required
      />

      <div className="flex gap-2">
        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 flex-1"
          placeholder="SKU *"
          value={form.sku}
          onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
          required
        />

        <button
          type="button"
          onClick={generateSku}
          className="bg-black text-white px-4 rounded-xl font-bold"
        >
          Auto
        </button>
      </div>

      <textarea
        className="border p-3 rounded-xl md:col-span-2 outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Product Description *"
        rows={5}
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-xl md:col-span-2 outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Image URL *"
        value={form.image}
        onChange={(e) => updateField("image", e.target.value)}
        required
      />

      {form.image && (
        <div className="md:col-span-2 rounded-2xl border bg-gray-50 p-4 w-fit">
          <p className="text-xs font-bold text-gray-500 mb-2">Preview</p>
          <img
            src={form.image}
            alt="Product preview"
            className="w-36 h-36 object-contain bg-white rounded-xl border"
          />
        </div>
      )}

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Colors comma separated e.g. Red, Blue"
        value={form.colors}
        onChange={(e) => updateField("colors", e.target.value)}
      />

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Sizes e.g. S, M, L, XL OR 500g, 1kg, 5kg"
        value={form.sizes}
        onChange={(e) => updateField("sizes", e.target.value)}
      />

      <button
        disabled={loading}
        className="md:col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-95 text-white py-3 rounded-xl font-extrabold transition disabled:from-gray-400 disabled:to-gray-400"
      >
        {loading ? "Submitting..." : "Submit Product For Approval"}
      </button>
    </form>
  );
}