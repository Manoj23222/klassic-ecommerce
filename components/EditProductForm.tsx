"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const categories = [
  "General",
  "Grocery",
  "Fruits & Vegetables",
  "Atta Rice & Dal",
  "Masala & Spices",
  "Papad & Pickles",
  "Oil & Ghee",
  "Snacks & Namkeen",
  "Biscuits & Cookies",
  "Tea & Coffee",
  "Milk & Dairy",
  "Bread & Bakery",
  "Cleaning & Household",
  "Personal Care",
  "Baby Care",
  "Pet Food",
  "Frozen Food",
  "Home & Kitchen",
  "Fashion",
  "Electronics",
  "Books",
  "Sports",
];

const statuses = ["Pending Approval", "Approved", "Rejected", "Draft"];

function normalizeArray(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}

export default function EditProductForm({ product }: { product: any }) {
  const productId = String(product._id || product.id || "");

  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price || ""));
  const [salePrice, setSalePrice] = useState(String(product.sale_price || product.salePrice || ""));
  const [stock, setStock] = useState(String(product.stock ?? 0));
  const [category, setCategory] = useState(product.category || "General");
  const [status, setStatus] = useState(product.status || "Pending Approval");
  const [featured, setFeatured] = useState(Boolean(product.featured));
  const [image, setImage] = useState(product.image || "");
  const [galleryImages, setGalleryImages] = useState(normalizeArray(product.gallery_images));
  const [colors, setColors] = useState(normalizeArray(product.colors));
  const [sizes, setSizes] = useState(normalizeArray(product.sizes));
  const [showQuantityPricing, setShowQuantityPricing] = useState(
  product.showQuantityPricing !== false
);
const [quantityPrices, setQuantityPrices] = useState(
  Array.isArray(product.quantityPrices) && product.quantityPrices.length > 0
    ? product.quantityPrices.map((x: any) => ({
        label: x.label || "",
        price: String(x.price || ""),
      }))
    : [
        { label: "100 g", price: "" },
        { label: "500 g", price: "" },
        { label: "1 kg", price: "" },
        { label: "5 kg", price: "" },
      ]
);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Upload valid image");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) return toast.error(data.message || "Upload failed");

      setImage(data.imageUrl);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  const uploadGalleryImage = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    toast.error("Upload valid image");
    return;
  }

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data.message || "Gallery upload failed");
      return;
    }

    setGalleryImages((prev) =>
      prev ? `${prev}, ${data.imageUrl}` : data.imageUrl
    );

    toast.success("Gallery image added");
  } catch {
    toast.error("Gallery upload failed");
  } finally {
    setUploading(false);
  }
};

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const galleryArray = galleryImages.split(",").map((x) => x.trim()).filter(Boolean);
    const quantityArray = quantityPrices
  .map((x: any) => x.label.trim())
  .filter(Boolean);
    const colorsArray = colors.split(",").map((x) => x.trim()).filter(Boolean);
    const sizesArray = sizes.split(",").map((x) => x.trim()).filter(Boolean);

    if (!name.trim()) return toast.error("Product name required");
    if (!description.trim()) return toast.error("Description required");
    if (Number(price) <= 0) return toast.error("Valid price required");
    if (Number(stock) < 0) return toast.error("Valid stock required");

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/products/${productId}`, {
  method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          name,
          description,
          price: Number(price),
          sale_price: salePrice ? Number(salePrice) : undefined,
          salePrice: salePrice ? Number(salePrice) : undefined,
          stock: Number(stock),
          category,
          status,
          featured,
showQuantityPricing,
image,
          gallery_images: galleryArray,
          images: galleryArray,
          colors: colorsArray,
          sizes: sizesArray,
         quantityOptions: quantityArray,
quantities: quantityArray,
weightOptions: quantityArray,

quantityPrices: quantityPrices
  .filter((x: any) => x.label.trim())
  .map((x: any) => ({
    label: x.label.trim(),
    price: Number(x.price || 0),
  })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) return toast.error(data.message || "Update failed");

      toast.success("Product updated");
      setTimeout(() => (window.location.href = "/admin/products"), 800);
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    const ok = confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) return toast.error(data.message || "Delete failed");

      toast.success("Product deleted");
      setTimeout(() => (window.location.href = "/admin/products"), 800);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const galleryList = galleryImages.split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <form onSubmit={updateProduct} className="grid gap-5">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-700 p-5 text-white">
        <input
  className="rounded-xl border p-3"
  placeholder="Product Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>


        <h2 className="text-2xl font-black">Luxury Product Control</h2>
        <p className="mt-1 text-sm text-blue-100">
          Edit product, price, stock, status, quantity, images and variants.
        </p>
      </div>
<label className="flex items-center gap-3 rounded-xl border bg-slate-50 p-4 font-bold">
  <input
    type="checkbox"
    checked={showQuantityPricing}
    onChange={(e) => setShowQuantityPricing(e.target.checked)}
  />
  Show Quantity Pricing on Product Page
</label>
      <div className="rounded-2xl border bg-slate-50 p-4">
  <p className="mb-3 text-sm font-black">Quantity Wise Pricing</p>

  <div className="space-y-3">
    {quantityPrices.map((item: any, index: number) => (
      <div key={index} className="grid grid-cols-2 gap-3">
        <input
          className="rounded-xl border bg-white p-3 text-sm font-semibold"
          placeholder="100 g / 500 g / 1 kg"
          value={item.label}
          onChange={(e) => {
            const copy = [...quantityPrices];
            copy[index].label = e.target.value;
            setQuantityPrices(copy);
          }}
        />

        <input
          className="rounded-xl border bg-white p-3 text-sm font-semibold"
          type="number"
          placeholder="Price"
          value={item.price}
          onChange={(e) => {
            const copy = [...quantityPrices];
            copy[index].price = e.target.value;
            setQuantityPrices(copy);
          }}
        />
      </div>
    ))}
  </div>
</div>

      <textarea className="rounded-xl border p-3" placeholder="Description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="grid gap-4 md:grid-cols-4">
        <input className="rounded-xl border p-3" type="number" placeholder="MRP / Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="rounded-xl border p-3" type="number" placeholder="Sale Price" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        <input className="rounded-xl border p-3" type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <select className="rounded-xl border p-3" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <select className="rounded-xl border p-3" value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => <option key={cat}>{cat}</option>)}
      </select>

  

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border p-3" placeholder="Colors comma separated" value={colors} onChange={(e) => setColors(e.target.value)} />
        <input className="rounded-xl border p-3" placeholder="Sizes comma separated" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 font-bold">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        ⭐ Featured Product
      </label>

      <div
        className="rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file);
        }}
      >
        <p className="font-black">Drag & Drop Main Image</p>
        <input className="mt-3" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
      </div>

      {uploading && <p className="rounded-xl bg-blue-50 p-3 font-bold text-blue-700">Uploading...</p>}

      <input className="rounded-xl border p-3" placeholder="Main Image URL" value={image} onChange={(e) => setImage(e.target.value)} />

      {image && (
  <div className="w-fit rounded-2xl border bg-white p-3">
    <img
      src={image}
      alt="Preview"
      className="h-40 w-40 rounded-xl bg-white object-contain"
    />

    <button
      type="button"
      onClick={() => setImage("")}
      className="mt-3 w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"
    >
      Delete Main Image
    </button>
  </div>
)}
<div
  className="rounded-3xl border-2 border-dashed border-purple-300 bg-purple-50 p-8 text-center"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    files.forEach((file) => uploadGalleryImage(file));
  }}
>
  <p className="font-black">Drag & Drop Gallery Images</p>

  <input
    className="mt-3"
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => uploadGalleryImage(file));
    }}
  />
</div>
      <textarea
        className="rounded-xl border p-3"
        placeholder="Gallery URLs comma separated"
        rows={4}
        value={galleryImages}
        onChange={(e) => setGalleryImages(e.target.value)}
      />

      {galleryList.length > 0 && (
        <div className="rounded-2xl border bg-slate-50 p-4">
          <h3 className="mb-3 font-black">Gallery Preview</h3>
          <div className="flex flex-wrap gap-3">
            {galleryList.map((img, i) => (
  <div key={`${img}-${i}`} className="rounded-xl border bg-white p-2">
    <img
      src={img}
      alt=""
      className="h-24 w-24 rounded-lg object-contain"
    />

    <button
      type="button"
      onClick={() => {
        const updated = galleryList.filter((_, index) => index !== i);
        setGalleryImages(updated.join(", "));
      }}
      className="mt-2 w-full rounded-lg bg-red-600 px-2 py-1 text-xs font-black text-white"
    >
      Delete
    </button>
  </div>
))}
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 font-black text-white disabled:bg-gray-400"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={deleteProduct}
          className="rounded-xl bg-red-600 p-4 font-black text-white disabled:bg-gray-400"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </form>
  );
}