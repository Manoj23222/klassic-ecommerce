"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SellerAddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    colors: "",
    sizes: "",
    sku: "",
  });

  const [image, setImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Upload failed");
    }

    return data.imageUrl;
  };

  const handleMainImage = async (file: File) => {
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("Main image uploaded");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleGalleryImages = async (files: FileList) => {
    try {
      const urls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }

      setGalleryImages((prev) => [...prev, ...urls]);
      toast.success("Gallery uploaded");
    } catch {
      toast.error("Gallery upload failed");
    }
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const seller = JSON.parse(localStorage.getItem("seller") || "{}");

    if (!seller?.id) {
      toast.error("Please login as seller first");
      router.push("/seller/login");
      return;
    }

    if (!image) {
      toast.error("Please upload main image");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_id: seller.id,
          seller_store_name: seller.storeName || "",
          name: form.name,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          image,
          gallery_images: galleryImages,
          colors: form.colors,
          sizes: form.sizes,
          sku: form.sku,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product submitted for approval");
        router.push("/seller/products");
      } else {
        toast.error(data.message || "Product submit failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6">Add Product</h1>

        <form onSubmit={submitProduct} className="space-y-5">
          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <textarea
            className="w-full border p-3 rounded-xl h-32"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              className="border p-3 rounded-xl"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>

          <input
            className="w-full border p-3 rounded-xl"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl"
              placeholder="Colors: Red, Black, Blue"
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Sizes: S, M, L, XL"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            />
          </div>

          <div
            className="border-2 border-dashed rounded-2xl p-8 text-center bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleMainImage(file);
            }}
          >
            <p className="font-semibold">Main Image Drag & Drop</p>

            <input
              type="file"
              accept="image/*"
              className="mt-4"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleMainImage(e.target.files[0]);
                }
              }}
            />

            {image && (
              <img
                src={image}
                alt="Main Preview"
                className="w-40 h-40 object-cover mx-auto mt-4 rounded-xl"
              />
            )}
          </div>

          <div className="border rounded-2xl p-6 bg-gray-50">
            <p className="font-semibold mb-3">Gallery Images</p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) handleGalleryImages(e.target.files);
              }}
            />

            <div className="flex flex-wrap gap-3 mt-4">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Gallery Preview"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}