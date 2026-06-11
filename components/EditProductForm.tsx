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

export default function EditProductForm({ product }: { product: any }) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [stock, setStock] = useState(product.stock || "");
  const [category, setCategory] = useState(product.category || "General");
  const [featured, setFeatured] = useState(
    product.featured === 1 || product.featured === true
  );
  const [image, setImage] = useState(product.image || "");
  const [galleryImages, setGalleryImages] = useState(product.gallery_images || "");
  const [colors, setColors] = useState(product.colors || "");
  const [sizes, setSizes] = useState(product.sizes || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadImage = async (file: File) => {
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
        setImage(data.imageUrl);
        toast.success("Product image uploaded");
      } else {
        toast.error(data.message || "Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) return toast.error("Enter product name");
    if (description.trim().length < 5) return toast.error("Enter product description");
    if (!price || Number(price) <= 0) return toast.error("Enter valid product price");
    if (!stock || Number(stock) < 0) return toast.error("Enter valid stock");
    if (!image.trim()) return toast.error("Please upload or enter main image");

    try {
      setSaving(true);

      const res = await fetch("/api/admin/update-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          name,
          description,
          price,
          stock,
          category,
          image,
          featured,
          gallery_images: galleryImages,
          colors,
          sizes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product updated successfully");

        setTimeout(() => {
          window.location.href = "/admin/product";
        }, 1200);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const galleryList = galleryImages
    .split(",")
    .map((img: string) => img.trim())
    .filter(Boolean);

  return (
    <form onSubmit={updateProduct} className="grid gap-5">
      <div className="rounded-2xl border bg-gradient-to-r from-indigo-50 to-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-gray-900">
          Edit Product
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update product details, inventory, variants and gallery images.
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
        rows={4}
        value={description}
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

      <label className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="font-bold">⭐ Featured Product</span>
      </label>

      <div
        className="border-2 border-dashed border-blue-300 p-8 rounded-2xl text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file);
        }}
      >
        <p className="font-extrabold text-lg text-gray-900">
          Drag & Drop Product Image Here
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Or choose file below
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl font-bold text-sm">
          Uploading image...
        </div>
      )}

      <input
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />

      {image && (
        <div className="rounded-2xl border bg-white p-4 w-fit">
          <p className="text-xs font-bold text-gray-500 mb-2">
            Main Preview
          </p>
          <img
            src={image}
            alt="Preview"
            className="w-40 h-40 object-contain rounded-xl bg-gray-50"
          />
        </div>
      )}

      <textarea
        className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Gallery Images URLs comma separated"
        rows={4}
        value={galleryImages}
        onChange={(e) => setGalleryImages(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Colors comma separated e.g. Black, Brown, Blue"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />

        <input
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sizes comma separated e.g. S, M, L, XL"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />
      </div>

      {galleryList.length > 0 && (
        <div className="rounded-2xl border bg-gray-50 p-4">
          <h3 className="font-extrabold mb-3">Gallery Preview</h3>

          <div className="flex gap-3 flex-wrap">
            {galleryList.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`Gallery ${index}`}
                className="w-24 h-24 object-contain border rounded-xl bg-white p-2"
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white p-4 rounded-xl font-extrabold transition disabled:from-gray-400 disabled:to-gray-400"
      >
        {saving ? "Updating Product..." : "Update Product"}
      </button>
    </form>
  );
}