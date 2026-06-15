"use client";

import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type SpecRow = { key: string; value: string };

const categories: Record<string, string[]> = {
  Fashion: ["Men", "Women", "Kids", "Footwear", "Accessories"],
  Electronics: ["Mobiles", "Laptop", "Camera", "Audio", "Accessories"],
  Grocery: ["Fruits", "Vegetables", "Snacks", "Beverages", "Household"],
  Home: ["Furniture", "Decor", "Kitchen", "Storage", "Lighting"],
  Beauty: ["Skincare", "Haircare", "Makeup", "Perfume"],
};

export default function AddSellerProductPage() {
  const [loading, setLoading] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");

  const [category, setCategory] = useState("Fashion");
  const [subcategory, setSubcategory] = useState("Men");

  const [videoUrl, setVideoUrl] = useState("");
  const [tags, setTags] = useState("");

  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [gst, setGst] = useState("");

  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [stockStatus, setStockStatus] = useState("In Stock");

  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");

  const [shippingWeight, setShippingWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [shippingCharges, setShippingCharges] = useState("");
  const [freeShipping, setFreeShipping] = useState(true);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [slug, setSlug] = useState("");

  const [features, setFeatures] = useState("");
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: "", value: "" }]);

  const [returnAvailable, setReturnAvailable] = useState(true);
  const [returnDays, setReturnDays] = useState("7");
  const [warranty, setWarranty] = useState("");
  const [cod, setCod] = useState(true);

  const [featured, setFeatured] = useState(false);
  const [flashSale, setFlashSale] = useState(false);
  const [discount, setDiscount] = useState("");

  const sku = useMemo(() => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    const cleanCat = category.slice(0, 3).toUpperCase();
    return `KL-${cleanCat}-${cleanName || "PROD"}-${Date.now().toString().slice(-5)}`;
  }, [name, category]);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) throw new Error("Upload failed");

    return data.imageUrl;
  }

  async function handleMainUpload(file: File) {
    try {
      toast.loading("Uploading main image...");
      const url = await uploadFile(file);
      setMainImage(url);
      toast.dismiss();
      toast.success("Main image uploaded");
    } catch {
      toast.dismiss();
      toast.error("Main image upload failed");
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files) return;

    try {
      toast.loading("Uploading gallery images...");
      const uploaded = await Promise.all(Array.from(files).map(uploadFile));
      setGallery((prev) => [...prev, ...uploaded]);
      toast.dismiss();
      toast.success("Gallery uploaded");
    } catch {
      toast.dismiss();
      toast.error("Gallery upload failed");
    }
  }

  function aiTitle() {
    const title = `${brand ? brand + " " : ""}${name || category} - Premium ${subcategory} Product`;
    setName(title);
    setSeoTitle(title);
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    toast.success("AI title generated");
  }

  function aiDescription() {
    const text = `Premium quality ${name || "product"} designed for modern customers. It offers excellent value, reliable performance, and stylish looks. Perfect for daily use with trusted quality.`;
    setDescription(text);
    setShortDescription(text.slice(0, 120));
    toast.success("AI description generated");
  }

  function aiSeo() {
    setSeoTitle(`${name || "Premium Product"} Online at Best Price | Klassic`);
    setSeoDescription(`Buy ${name || "premium product"} online on Klassic. Best price, fast delivery, COD and easy return available.`);
    setSeoKeywords(`${name}, ${category}, ${subcategory}, buy online, Klassic`);
    toast.success("AI SEO generated");
  }

  async function submitProduct(status: "Draft" | "Pending Approval") {
    if (!name || !regularPrice || !stock || !mainImage) {
      toast.error("Name, price, stock and main image required");
      return;
    }

    const seller = JSON.parse(localStorage.getItem("seller") || "{}");

    setLoading(true);

    const payload = {
      seller_id: seller?._id || seller?.id,
      seller_store_name: seller?.storeName || seller?.store_name || "Klassic Seller",

      name,
      shortDescription,
      description,
      brand,
      sku,
      category,
      subcategory,
      tags: tags.split(",").map((x) => x.trim()).filter(Boolean),

      price: Number(salePrice || regularPrice),
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice || regularPrice),
      costPrice: Number(costPrice || 0),
      gst: Number(gst || 0),

      stock: Number(stock),
      lowStock: Number(lowStock || 0),
      stockStatus,

      image: mainImage,
      gallery_images: gallery,
      videoUrl,

      colors: colors.split(",").map((x) => x.trim()).filter(Boolean),
      sizes: sizes.split(",").map((x) => x.trim()).filter(Boolean),
      material,
      weight,

      shipping: {
        shippingWeight,
        length,
        width,
        height,
        shippingCharges: Number(shippingCharges || 0),
        freeShipping,
      },

      seo: {
        seoTitle,
        seoDescription,
        seoKeywords,
        slug,
      },

      features: features.split("\n").map((x) => x.trim()).filter(Boolean),
      specifications: specs.filter((s) => s.key && s.value),

      returnPolicy: {
        returnAvailable,
        returnDays: Number(returnDays),
        warranty,
        cod,
      },

      featured,
      flashSale,
      discount: Number(discount || 0),
      status,
    };

    const res = await fetch("/api/seller/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const data = await res.json();

setLoading(false);

if (res.ok && data.success) {
  toast.success(
    status === "Draft"
      ? "Product saved as draft"
      : "Product sent for approval"
  );
} else {
  toast.error(data.message || "Product submit failed");
}
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-3 py-5 md:px-8">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow">
          <h1 className="text-2xl font-black md:text-4xl">Add New Product</h1>
          <p className="mt-2 text-sm text-blue-100">
            Amazon + Flipkart style product listing page for Klassic marketplace.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card title="Images & Media">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleMainUpload(file);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center"
              >
                {mainImage ? (
                  <div className="relative">
                    <img src={mainImage} className="h-48 rounded-2xl object-cover" alt="Main" />
                    <button
                      onClick={() => setMainImage("")}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-blue-800">Drag & Drop Main Image</p>
                    <p className="text-sm text-gray-500">or click to upload</p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="mt-4"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMainUpload(file);
                  }}
                />
              </div>

              <div className="mt-5">
                <label className="font-bold">Gallery Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2 w-full rounded-xl border bg-white p-3"
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                />

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="relative rounded-2xl border bg-white p-2">
                      <img src={img} className="h-28 w-full rounded-xl object-cover" alt="" />
                      <button
                        onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                        className="mt-2 w-full rounded-xl bg-red-50 py-2 text-sm font-bold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Input label="Product Video URL" value={videoUrl} setValue={setVideoUrl} />
            </Card>

            <Card title="Basic Information">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Product Name *" value={name} setValue={setName} />
                <Input label="Brand" value={brand} setValue={setBrand} />
                <Select label="Category *" value={category} setValue={(v) => {
                  setCategory(v);
                  setSubcategory(categories[v][0]);
                }} options={Object.keys(categories)} />
                <Select label="Sub Category" value={subcategory} setValue={setSubcategory} options={categories[category]} />
                <Input label="SKU Auto Generate" value={sku} setValue={() => {}} disabled />
                <Input label="Tags / Keywords" value={tags} setValue={setTags} />
              </div>

              <Textarea label="Short Description" value={shortDescription} setValue={setShortDescription} />
              <Textarea label="Full Description" value={description} setValue={setDescription} />
            </Card>

            <Card title="Pricing">
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Regular Price *" value={regularPrice} setValue={setRegularPrice} type="number" />
                <Input label="Sale Price" value={salePrice} setValue={setSalePrice} type="number" />
                <Input label="Cost Price" value={costPrice} setValue={setCostPrice} type="number" />
                <Input label="Tax/GST %" value={gst} setValue={setGst} type="number" />
              </div>
            </Card>

            <Card title="Inventory & Variants">
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Stock Quantity *" value={stock} setValue={setStock} type="number" />
                <Input label="Low Stock Alert" value={lowStock} setValue={setLowStock} type="number" />
                <Select label="Stock Status" value={stockStatus} setValue={setStockStatus} options={["In Stock", "Out of Stock"]} />
                <Input label="Colors Variants" value={colors} setValue={setColors} placeholder="Red, Blue, Black" />
                <Input label="Sizes Variants" value={sizes} setValue={setSizes} placeholder="S, M, L, XL" />
                <Input label="Material" value={material} setValue={setMaterial} />
                <Input label="Weight" value={weight} setValue={setWeight} />
              </div>
            </Card>

            <Card title="Shipping">
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Weight (kg)" value={shippingWeight} setValue={setShippingWeight} />
                <Input label="Length" value={length} setValue={setLength} />
                <Input label="Width" value={width} setValue={setWidth} />
                <Input label="Height" value={height} setValue={setHeight} />
                <Input label="Shipping Charges" value={shippingCharges} setValue={setShippingCharges} type="number" />
                <Toggle label="Free Shipping" value={freeShipping} setValue={setFreeShipping} />
              </div>
            </Card>

            <Card title="SEO">
              <Input label="SEO Title" value={seoTitle} setValue={setSeoTitle} />
              <Textarea label="SEO Description" value={seoDescription} setValue={setSeoDescription} />
              <Input label="SEO Keywords" value={seoKeywords} setValue={setSeoKeywords} />
              <Input label="URL Slug" value={slug} setValue={setSlug} />
            </Card>

            <Card title="Features & Specifications">
              <Textarea label="Feature List - one per line" value={features} setValue={setFeatures} />

              <div className="space-y-3">
                {specs.map((s, i) => (
                  <div key={i} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <input
                      className="rounded-xl border p-3"
                      placeholder="Specification name"
                      value={s.key}
                      onChange={(e) => {
                        const copy = [...specs];
                        copy[i].key = e.target.value;
                        setSpecs(copy);
                      }}
                    />
                    <input
                      className="rounded-xl border p-3"
                      placeholder="Value"
                      value={s.value}
                      onChange={(e) => {
                        const copy = [...specs];
                        copy[i].value = e.target.value;
                        setSpecs(copy);
                      }}
                    />
                    <button
                      onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                      className="rounded-xl bg-red-50 px-4 font-bold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => setSpecs([...specs, { key: "", value: "" }])}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
                >
                  + Add Specification
                </button>
              </div>
            </Card>

            <Card title="Return Policy & Marketplace Options">
              <div className="grid gap-4 md:grid-cols-3">
                <Toggle label="Return Available" value={returnAvailable} setValue={setReturnAvailable} />
                <Input label="Return Days" value={returnDays} setValue={setReturnDays} type="number" />
                <Input label="Warranty Period" value={warranty} setValue={setWarranty} />
                <Toggle label="Cash On Delivery" value={cod} setValue={setCod} />
                <Toggle label="Featured Product" value={featured} setValue={setFeatured} />
                <Toggle label="Flash Sale Product" value={flashSale} setValue={setFlashSale} />
                <Input label="Discount %" value={discount} setValue={setDiscount} type="number" />
              </div>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card title="AI Center">
              <button onClick={aiTitle} className="mb-3 w-full rounded-2xl bg-purple-600 py-3 font-bold text-white">
                AI Product Title
              </button>
              <button onClick={aiDescription} className="mb-3 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white">
                AI Description
              </button>
              <button onClick={aiSeo} className="w-full rounded-2xl bg-green-600 py-3 font-bold text-white">
                AI SEO
              </button>
            </Card>

            <Card title="Publish">
              <button
                disabled={loading}
                onClick={() => submitProduct("Pending Approval")}
                className="mb-3 w-full rounded-2xl bg-orange-500 py-4 font-black text-white shadow"
              >
                Submit For Approval
              </button>

              <button
                disabled={loading}
                onClick={() => submitProduct("Draft")}
                className="w-full rounded-2xl bg-slate-900 py-4 font-black text-white"
              >
                Save Draft
              </button>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <h2 className="mb-5 text-xl font-black text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
  placeholder = "",
  disabled = false,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
      >
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setValue(!value)}
      className={`rounded-2xl border p-4 text-left font-bold ${
        value ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300 bg-gray-50 text-gray-500"
      }`}
    >
      {label}: {value ? "Yes" : "No"}
    </button>
  );
}