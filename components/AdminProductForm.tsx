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

export default function AdminProductForm() {
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadImage = async (file: File, type: "main" | "gallery") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
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

      if (data.success) {
        const url = data.imageUrl || data.url;

        if (type === "main") {
          setImage(url);
          toast.success("Main image uploaded");
        } else {
          setGalleryImages((prev) => [...prev, url]);
          toast.success("Gallery image uploaded");
        }
      } else {
        toast.error(data.message || "Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) return toast.error("Enter product name");
    if (!sku.trim()) return toast.error("Enter SKU");
    if (!price || Number(price) <= 0) return toast.error("Enter valid price");
    if (Number(stock) < 0) return toast.error("Enter valid stock");
    if (!image.trim()) return toast.error("Please upload main image");

    try {
      setSaving(true);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: "admin",
          seller_store_name: "Klassic Admin",
          name,
          short_description: shortDescription,
          description,
          brand,
          sku,
          price,
          sale_price: salePrice,
          stock,
          category,
          sub_category: subCategory,
          tags,
          image,
          gallery_images: galleryImages,
          colors,
          sizes,
          status: "Approved",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product added successfully");
        window.location.reload();
      } else {
        toast.error(data.message || "Product add failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={addProduct} className="grid gap-5">
      <input className="border p-3 rounded-xl" placeholder="Product Name *" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-3 rounded-xl" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <input className="border p-3 rounded-xl" placeholder="SKU *" value={sku} onChange={(e) => setSku(e.target.value)} />

      <textarea className="border p-3 rounded-xl" placeholder="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />

      <textarea className="border p-3 rounded-xl" placeholder="Full Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="grid md:grid-cols-3 gap-4">
        <input className="border p-3 rounded-xl" placeholder="Price *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="border p-3 rounded-xl" placeholder="Sale Price" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        <input className="border p-3 rounded-xl" placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select className="border p-3 rounded-xl" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>

        <input className="border p-3 rounded-xl" placeholder="Sub Category" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
      </div>

      <input className="border p-3 rounded-xl" placeholder="Tags / Keywords" value={tags} onChange={(e) => setTags(e.target.value)} />

      <div className="grid md:grid-cols-2 gap-4">
        <input className="border p-3 rounded-xl" placeholder="Colors: Red, Blue" value={colors} onChange={(e) => setColors(e.target.value)} />
        <input className="border p-3 rounded-xl" placeholder="Sizes: S, M, L" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </div>

      <div className="border-2 border-dashed p-6 rounded-2xl text-center bg-blue-50">
        <p className="font-bold">Main Product Image</p>
        <input type="file" accept="image/*" className="mt-4" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file, "main");
        }} />
      </div>

      {image && <img src={image} alt="Preview" className="w-40 h-40 object-contain border rounded-xl" />}

      <div className="border-2 border-dashed p-6 rounded-2xl bg-gray-50">
        <p className="font-bold">Gallery Images</p>
        <input type="file" accept="image/*" multiple className="mt-4" onChange={(e) => {
          Array.from(e.target.files || []).forEach((file) => uploadImage(file, "gallery"));
        }} />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt="" className="w-full h-24 object-contain bg-white rounded-xl border" />
              <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded-lg">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploading && <div className="text-blue-700 font-bold">Uploading image...</div>}

      <button disabled={saving || uploading} className="bg-blue-600 text-white p-4 rounded-xl font-bold disabled:bg-gray-400">
        {saving ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}