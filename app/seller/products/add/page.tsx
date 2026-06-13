"use client";
import SellerTopBar from "@/components/SellerTopBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SellerAddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    short_description: "",
    description: "",
    brand: "",
    sku: "",
    category: "General",
    sub_category: "",
    tags: "",
    price: "",
    sale_price: "",
    stock: "",
    colors: "",
    sizes: "",
  });

  const [image, setImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid image file");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Upload failed");
    }

    return data.imageUrl || data.url;
  };

  const handleMainImage = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImage(url);
      toast.success("Main image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImages = async (files: FileList) => {
    try {
      setUploading(true);

      const urls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }

      setGalleryImages((prev) => [...prev, ...urls]);
      toast.success("Gallery uploaded");
    } catch {
      toast.error("Gallery upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller._id || seller.id;

    if (!sellerId) {
      toast.error("Please login as seller first");
      router.push("/seller/login");
      return;
    }

    if (!form.name.trim()) return toast.error("Product name required");
    if (!form.sku.trim()) return toast.error("SKU required");
    if (!form.price || Number(form.price) <= 0) {
      return toast.error("Valid price required");
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
          seller_id: sellerId,
          seller_store_name:
            seller.store_name || seller.storeName || seller.name || "",
          name: form.name,
          short_description: form.short_description,
          description: form.description,
          brand: form.brand,
          sku: form.sku,
          category: form.category,
          sub_category: form.sub_category,
          tags: form.tags,
          price: Number(form.price),
          sale_price: Number(form.sale_price || 0),
          stock: Number(form.stock || 0),
          image,
          gallery_images: galleryImages,
          colors: form.colors,
          sizes: form.sizes,
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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2">Add Product</h1>
        <p className="text-gray-600 mb-6">
          Product submit hone ke baad Admin approval me jayega.
        </p>

        <form onSubmit={submitProduct} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl"
              placeholder="Product Name *"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => updateForm("brand", e.target.value)}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="SKU *"
              value={form.sku}
              onChange={(e) => updateForm("sku", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Tags / Keywords"
              value={form.tags}
              onChange={(e) => updateForm("tags", e.target.value)}
            />
          </div>

          <textarea
            className="w-full border p-3 rounded-xl"
            placeholder="Short Description"
            value={form.short_description}
            onChange={(e) => updateForm("short_description", e.target.value)}
          />

          <textarea
            className="w-full border p-3 rounded-xl h-32"
            placeholder="Full Description"
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <select
              className="border p-3 rounded-xl"
              value={form.category}
              onChange={(e) => updateForm("category", e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Sub Category"
              value={form.sub_category}
              onChange={(e) => updateForm("sub_category", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="border p-3 rounded-xl"
              type="number"
              placeholder="Regular Price *"
              value={form.price}
              onChange={(e) => updateForm("price", e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-xl"
              type="number"
              placeholder="Sale Price"
              value={form.sale_price}
              onChange={(e) => updateForm("sale_price", e.target.value)}
            />

            <input
              className="border p-3 rounded-xl"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => updateForm("stock", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-xl"
              placeholder="Colors: Red, Black, Blue"
              value={form.colors}
              onChange={(e) => updateForm("colors", e.target.value)}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Sizes: S, M, L, XL"
              value={form.sizes}
              onChange={(e) => updateForm("sizes", e.target.value)}
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
                className="w-40 h-40 object-cover mx-auto mt-4 rounded-xl border"
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
                <div key={img + index} className="relative">
                  <img
                    src={img}
                    alt="Gallery Preview"
                    className="w-24 h-24 object-cover rounded-xl border"
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {uploading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl font-bold">
              Uploading image...
            </div>
          )}

          <button
            disabled={loading || uploading}
            className="bg-black text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </main>
  );
}