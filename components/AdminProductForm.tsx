"use client";

import { useState } from "react";

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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, type: "main" | "gallery") => {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      if (type === "main") {
        setImage(data.imageUrl);
      } else {
        setGalleryImages((prev) => [...prev, data.imageUrl]);
      }
    } else {
      alert("Image upload failed");
    }

    setUploading(false);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        stock,
        category,
        image,
        gallery_images: galleryImages.join(","),
        colors,
        sizes,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Product added successfully");
      window.location.reload();
    } else {
      alert("Product add failed");
    }
  };

  return (
    <form onSubmit={addProduct} className="grid gap-5">
      <input className="border p-3 rounded-xl" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />

      <textarea className="border p-3 rounded-xl" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

      <div className="grid md:grid-cols-3 gap-4">
        <input className="border p-3 rounded-xl" placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input className="border p-3 rounded-xl" placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <select className="border p-3 rounded-xl" value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input className="border p-3 rounded-xl" placeholder="Colors: Red, Blue, Black" value={colors} onChange={(e) => setColors(e.target.value)} />
        <input className="border p-3 rounded-xl" placeholder="Sizes: S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </div>

      <div
        className="border-2 border-dashed p-6 rounded-2xl text-center cursor-pointer bg-blue-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file, "main");
        }}
      >
        <p className="font-bold text-lg">Drag & Drop Main Product Image</p>
        <input type="file" accept="image/*" className="mt-4" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file, "main");
        }} />
      </div>

      <input className="border p-3 rounded-xl" placeholder="Main Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />

      {image && (
        <img src={image} alt="Preview" className="w-40 h-40 object-contain border rounded-xl bg-white" />
      )}

      <div
        className="border-2 border-dashed p-6 rounded-2xl bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          Array.from(e.dataTransfer.files).forEach((file) =>
            uploadImage(file, "gallery")
          );
        }}
      >
        <h3 className="font-bold text-lg mb-2">Gallery / Thumbnail Images</h3>
        <p className="text-sm text-gray-500">Drag multiple images here or choose files</p>

        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-4"
          onChange={(e) => {
            Array.from(e.target.files || []).forEach((file) =>
              uploadImage(file, "gallery")
            );
          }}
        />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt="" className="w-full h-24 object-contain bg-white rounded-xl border" />
              <button
                type="button"
                onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploading && <p className="text-blue-600 font-semibold">Uploading image...</p>}

      <button type="submit" className="bg-blue-600 text-white p-4 rounded-xl font-bold">
        Add Product
      </button>
    </form>
  );
}