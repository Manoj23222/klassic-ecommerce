"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ColorVariantManager, {
  ColorVariant,
} from "@/components/seller/ColorVariantManager";

export default function EditSellerProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const emptyVariant: ColorVariant = {
  colorName: "",
  colorCode: "#000000",
  color: "",
  size: "",
  sku: "",
  stock: "",
  price: "",
  sale_price: "",
  salePrice: "",
  regularPrice: "",
  image: "",
  images: [],
  isDefault: true,
};

const [variants, setVariants] = useState<ColorVariant[]>([emptyVariant]);
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    description: "",
    brand: "",
    sku: "",
    category: "",
    sub_category: "",
    tags: "",
    price: "",
    sale_price: "",
    stock: "",
    image: "",
    gallery_images: [] as string[],
    colors: "",
    sizes: "",
  });

  useEffect(() => {
    const start = async () => {
      const sellerData = localStorage.getItem("seller");

      if (!sellerData) {
        toast.error("Please login first");
        router.push("/seller/login");
        return;
      }

      const seller = JSON.parse(sellerData);
      const sid = seller._id || seller.id;

      if (!sid) {
        toast.error("Seller ID not found");
        router.push("/seller/login");
        return;
      }

      setSellerId(sid);
      await loadProduct(sid);
    };

    start();
  }, [id, router]);

  const loadProduct = async (sid: string) => {
    try {
      const res = await fetch(`/api/seller/products/${id}?seller_id=${sid}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Product not found");
        router.push("/seller/products");
        return;
      }

      const p = data.product;
      setVariants(
  p.variants?.length
    ? p.variants.map((v: any) => ({
  colorName: v.colorName || v.color || "",
  colorCode: v.colorCode || "#000000",
  color: v.color || v.colorName || "",
  size: v.size || "",
  sku: v.sku || "",
  stock: String(v.stock || ""),
  price: String(v.price || v.regularPrice || ""),
  sale_price: String(v.sale_price || v.salePrice || ""),
  salePrice: String(v.salePrice || v.sale_price || ""),
  regularPrice: String(v.regularPrice || v.price || ""),
  image: v.image || v.images?.[0] || "",
  images: v.images || (v.image ? [v.image] : []),
  isDefault: Boolean(v.isDefault),
}))
    : [emptyVariant]
);


      setForm({
        name: p.name || "",
        short_description: p.short_description || "",
        description: p.description || "",
        brand: p.brand || "",
        sku: p.sku || "",
        category: p.category || "",
        sub_category: p.sub_category || "",
        tags: p.tags || "",
        price: String(p.price || ""),
        sale_price: String(p.sale_price || ""),
        stock: String(p.stock || ""),
        image: p.image || "",
        gallery_images: p.gallery_images || [],
        colors: p.colors || "",
        sizes: p.sizes || "",
      });
    } catch {
      toast.error("Product load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      toast.error("Image upload failed");
      return "";
    }

    return data.imageUrl || data.url;
  };

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading image...");
    const url = await uploadImage(file);
    toast.dismiss();

    if (url) {
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    }
  };

  const handleGalleryImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    toast.loading("Uploading gallery...");
    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }

    toast.dismiss();

    setForm((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, ...urls],
    }));

    toast.success("Gallery uploaded");
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing");
      return;
    }

    if (!form.name || !form.price || !form.category || !form.sku) {
      toast.error("Name, price, category and SKU required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/seller/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  ...form,
  variants,
  seller_id: sellerId,
}),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Product updated. Pending approval now.");
      router.push("/seller/products");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-xl font-bold">Loading product...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-600">
              After update, product will go to Pending Approval.
            </p>
          </div>

          <Link
            href="/seller/products"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Back
          </Link>
        </div>

        <form
          onSubmit={submitProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name *"
            className="border p-3 rounded-lg"
          />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border p-3 rounded-lg"
          />

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU *"
            className="border p-3 rounded-lg"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category *"
            className="border p-3 rounded-lg"
          />

          <input
            name="sub_category"
            value={form.sub_category}
            onChange={handleChange}
            placeholder="Sub Category"
            className="border p-3 rounded-lg"
          />

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags / Keywords"
            className="border p-3 rounded-lg"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Regular Price *"
            className="border p-3 rounded-lg"
          />

          <input
            name="sale_price"
            value={form.sale_price}
            onChange={handleChange}
            type="number"
            placeholder="Sale Price"
            className="border p-3 rounded-lg"
          />

          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock Quantity"
            className="border p-3 rounded-lg"
          />

          <input
            name="colors"
            value={form.colors}
            onChange={handleChange}
            placeholder="Colors comma separated"
            className="border p-3 rounded-lg"
          />

          <input
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="Sizes comma separated"
            className="border p-3 rounded-lg"
          />

          <textarea
            name="short_description"
            value={form.short_description}
            onChange={handleChange}
            placeholder="Short Description"
            className="border p-3 rounded-lg md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Full Description"
            rows={5}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <div className="md:col-span-2 border rounded-xl p-4">
            <label className="font-bold block mb-2">Main Product Image</label>
            <input type="file" accept="image/*" onChange={handleMainImage} />

            {form.image && (
              <img
                src={form.image}
                alt="Main"
                className="w-32 h-32 object-cover rounded-lg mt-4 border"
              />
            )}
          </div>

          <div className="md:col-span-2 border rounded-xl p-4">
            <label className="font-bold block mb-2">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImages}
            />

            <div className="flex flex-wrap gap-3 mt-4">
              {form.gallery_images.map((img, index) => (
                <div key={img + index} className="relative">
                  <img
                    src={img}
                    alt="Gallery"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                  >
                  
                  </button>
                </div>
              ))}
            </div>
          </div>
<div className="md:col-span-2">
  <ColorVariantManager
    variants={variants}
    setVariants={setVariants}
    uploadImage={uploadImage}
  />
</div>
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? "Updating..." : "Update Product & Send For Approval"}
          </button>
        </form>
      </div>
    </main>
  );
}