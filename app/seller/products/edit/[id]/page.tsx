"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ColorVariantManager, {
  ColorVariant,
} from "@/components/seller/ColorVariantManager";

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

function toText(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}

function toArray(value: any) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

export default function EditSellerProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sellerId, setSellerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [variants, setVariants] = useState<ColorVariant[]>([emptyVariant]);
const [quantityPrices, setQuantityPrices] = useState([
  { label: "100 g", price: "" },
  { label: "500 g", price: "" },
  { label: "1 kg", price: "" },
  { label: "5 kg", price: "" },
]);


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
    quantityOptions: "",
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
        short_description: p.short_description || p.shortDescription || "",
        description: p.description || "",
        brand: p.brand || "",
        sku: p.sku || "",
        category: p.category || "",
        sub_category: p.sub_category || p.subcategory || "",
        tags: toText(p.tags),
        price: String(p.price || ""),
        sale_price: String(p.sale_price || p.salePrice || ""),
        stock: String(p.stock || ""),
        image: p.image || "",
        gallery_images: p.gallery_images || p.images || [],
        colors: toText(p.colors),
        sizes: toText(p.sizes),
        quantityOptions: toText(
          p.quantityOptions || p.quantities || p.weightOptions
        ),
      });
      if (Array.isArray(p.quantityPrices) && p.quantityPrices.length > 0) {
  setQuantityPrices(
    p.quantityPrices.map((x: any) => ({
      label: x.label || "",
      price: String(x.price || ""),
    }))
  );
} else if (
  Array.isArray(p.quantityOptions) &&
  p.quantityOptions.length > 0
) {
  setQuantityPrices(
    p.quantityOptions.map((x: any) => ({
      label: String(x),
      price: "",
    }))
  );
}
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
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload image file");
      return "";
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "Image upload failed");
      return "";
    }

    return data.imageUrl || data.url;
  };

  const uploadMainFile = async (file: File) => {
    toast.loading("Uploading main image...");
    const url = await uploadImage(file);
    toast.dismiss();

    if (url) {
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Main image uploaded");
    }
  };

  const uploadGalleryFiles = async (files: File[]) => {
    if (files.length === 0) return;

    toast.loading("Uploading gallery images...");
    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }

    toast.dismiss();

    if (urls.length > 0) {
      setForm((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...urls],
      }));
      toast.success("Gallery images uploaded");
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerId) return toast.error("Seller ID missing");
    if (!form.name || !form.price || !form.category || !form.sku) {
      toast.error("Name, price, category and SKU required");
      return;
    }

    setSaving(true);

    try {
      const quantityArray = quantityPrices
  .map((x) => x.label.trim())
  .filter(Boolean);

      const res = await fetch(`/api/seller/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          tags: toArray(form.tags),
          colors: toArray(form.colors),
          sizes: toArray(form.sizes),
          quantityOptions: quantityArray,
quantities: quantityArray,
weightOptions: quantityArray,

quantityPrices: quantityPrices
  .filter((x) => x.label.trim())
  .map((x) => ({
    label: x.label.trim(),
    price: Number(x.price || 0),
  })),

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
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-xl font-black shadow-xl">
          Loading product...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[2rem] bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">
                Seller Product Studio
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Edit Product
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Product info, gallery, quantity, variants, pricing and stock
                update karo.
              </p>
            </div>

            <Link
              href="/seller/products"
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950"
            >
              ← Back
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-[2rem] border bg-white p-4 shadow-xl lg:sticky lg:top-6">
            <img
              src={form.image || "/placeholder.png"}
              alt={form.name}
              className="h-64 w-full rounded-2xl bg-slate-50 object-contain p-3"
            />

            <h2 className="mt-4 line-clamp-2 text-xl font-black">
              {form.name || "Product Name"}
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              {form.category || "Category"}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="font-black">₹{form.sale_price || form.price}</p>
                <p className="text-slate-500">Price</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="font-black">{form.stock || 0}</p>
                <p className="text-slate-500">Stock</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-xs font-bold text-orange-700">
              After update product will go to Pending Approval.
            </div>
          </aside>

          <section className="rounded-[2rem] border bg-white p-4 shadow-xl sm:p-6">
            <form
              onSubmit={submitProduct}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name *" />
              <Input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" />
              <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU *" />
              <Input name="category" value={form.category} onChange={handleChange} placeholder="Category *" />
              <Input name="sub_category" value={form.sub_category} onChange={handleChange} placeholder="Sub Category" />
              <Input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags / Keywords" />
              <Input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Regular Price *" />
              <Input name="sale_price" value={form.sale_price} onChange={handleChange} type="number" placeholder="Sale Price" />
              <Input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="Stock Quantity" />
              <Input name="colors" value={form.colors} onChange={handleChange} placeholder="Colors comma separated" />
              <Input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Sizes comma separated" />

              <div className="md:col-span-2 rounded-2xl border bg-slate-50 p-4">
  <p className="mb-3 text-sm font-black">Quantity Wise Pricing</p>

  <div className="space-y-3">
    {quantityPrices.map((item, index) => (
      <div key={index} className="grid grid-cols-2 gap-3">
        <Input
          value={item.label}
          placeholder="100 g / 500 g / 1 kg"
          onChange={(e) => {
            const copy = [...quantityPrices];
            copy[index].label = e.target.value;
            setQuantityPrices(copy);
          }}
        />

        <Input
          type="number"
          value={item.price}
          placeholder="Price"
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

              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="Short Description"
                className="rounded-xl border bg-white p-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:col-span-2"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Full Description"
                rows={5}
                className="rounded-xl border bg-white p-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:col-span-2"
              />

              <UploadBox
                title="Main Product Image"
                subtitle="Drag & drop main image here"
                onDropFiles={(files) => uploadMainFile(files[0])}
              />

              {form.image && (
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-black">Main Preview</p>
                  <img
                    src={form.image}
                    alt="Main"
                    className="h-40 w-40 rounded-xl border bg-white object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"
                  >
                    Delete Main Image
                  </button>
                </div>
              )}

              <div className="md:col-span-2">
                <UploadBox
                  title="Gallery Images"
                  subtitle="Drag & drop multiple gallery images"
                  multiple
                  onDropFiles={uploadGalleryFiles}
                />

                {form.gallery_images.length > 0 && (
                  <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-black">Gallery Preview</p>
                    <div className="flex flex-wrap gap-3">
                      {form.gallery_images.map((img, index) => (
                        <div
                          key={img + index}
                          className="rounded-2xl border bg-white p-2"
                        >
                          <img
                            src={img}
                            alt="Gallery"
                            className="h-28 w-28 rounded-xl object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="mt-2 w-full rounded-lg bg-red-600 py-1 text-xs font-black text-white"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 rounded-[2rem] border bg-slate-50 p-4">
                <ColorVariantManager
                  variants={variants}
                  setVariants={setVariants}
                  uploadImage={uploadImage}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="md:col-span-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-black text-white shadow-lg disabled:from-gray-400 disabled:to-gray-400"
              >
                {saving ? "Updating..." : "Update Product & Send For Approval"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-xl border bg-white p-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function UploadBox({
  title,
  subtitle,
  multiple = false,
  onDropFiles,
}: {
  title: string;
  subtitle: string;
  multiple?: boolean;
  onDropFiles: (files: File[]) => void;
}) {
  return (
    <div
      className="rounded-[2rem] border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center transition hover:bg-blue-100 md:col-span-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length > 0) onDropFiles(files);
      }}
    >
      <p className="text-lg font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="mt-4"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) onDropFiles(files);
        }}
      />
    </div>
  );
}