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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
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
        if (type === "main") {
          setImage(data.imageUrl);
          toast.success("Main image uploaded");
        } else {
          setGalleryImages((prev) => [...prev, data.imageUrl]);
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
    if (description.trim().length < 5) return toast.error("Enter product description");
    if (!price || Number(price) <= 0) return toast.error("Enter valid product price");
    if (!stock || Number(stock) < 0) return toast.error("Enter valid stock");
    if (!image.trim()) return toast.error("Please upload or enter main image");

    try {
      setSaving(true);

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
        toast.success("Product added successfully");

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Product add failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={addProduct} className="grid gap-5">
      <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <h2 className="text-xl font-extrabold text-gray-900">
          Add New Product
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload product details, variants and gallery images for Klassic store.
        </p>
      </div>

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Description"
        value={description}
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="grid md:grid-cols-3 gap-4">
        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <select
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Colors: Red, Blue, Black"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />

        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sizes: S, M, L, XL"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />
      </div>

      <div
        className="border-2 border-dashed border-blue-300 p-6 rounded-2xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file, "main");
        }}
      >
        <p className="font-extrabold text-lg text-gray-900">
          Drag & Drop Main Product Image
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Or choose image from your device
        </p>

        <input
          type="file"
          accept="image/*"
          className="mt-4"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, "main");
          }}
        />
      </div>

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Main Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />

      {image && (
        <div className="rounded-2xl border bg-white p-4 w-fit">
          <p className="text-xs font-bold text-gray-500 mb-2">Main Preview</p>
          <img
            src={image}
            alt="Preview"
            className="w-40 h-40 object-contain rounded-xl bg-gray-50"
          />
        </div>
      )}

      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          Array.from(e.dataTransfer.files).forEach((file) =>
            uploadImage(file, "gallery")
          );
        }}
      >
        <h3 className="font-extrabold text-lg mb-1">
          Gallery / Thumbnail Images
        </h3>
        <p className="text-sm text-gray-500">
          Drag multiple images here or choose files
        </p>

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
            <div key={index} className="relative group">
              <img
                src={img}
                alt=""
                className="w-full h-24 object-contain bg-white rounded-xl border"
              />

              <button
                type="button"
                onClick={() =>
                  setGalleryImages(galleryImages.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded-lg font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl font-bold text-sm">
          Uploading image...
        </div>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-extrabold hover:opacity-95 transition disabled:from-gray-400 disabled:to-gray-400"
      >
        {saving ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}