"use client";

import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CategorySelector from "@/components/seller/CategorySelector";
import ColorVariantManager, {
  ColorVariant,
} from "@/components/seller/ColorVariantManager";
import DynamicAttributeForm from "@/components/DynamicAttributeForm";

type Rule = {
  _id?: string;
  fieldName: string;
  fieldKey: string;
  fieldType: string;
  options?: string[];
  placeholder?: string;
  unit?: string;
  required?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  showOnProductPage?: boolean;
};

const steps = [
  "Basic Info",
  "Category Specifications",
  "Variations & SKUs",
  "Media Gallery",
  "Highlights & Description",
  "Compliance & Legal",
  "Shipping Logistics",
  "Warranty & Support",
];

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

export default function AddSellerProductPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categorySlug, setCategorySlug] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [attributes, setAttributes] = useState<Record<string, any>>({});

  const [brand, setBrand] = useState("");
  const [brandVerified, setBrandVerified] = useState(false);
  const [name, setName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [mainSku, setMainSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [variants, setVariants] = useState<ColorVariant[]>([emptyVariant]);

  const [variationTheme, setVariationTheme] = useState("Color");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  const [highlights, setHighlights] = useState([""]);
  const [searchTags, setSearchTags] = useState("");

  const [hsnCode, setHsnCode] = useState("");
  const [gst, setGst] = useState("18");
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");
  const [manufacturer, setManufacturer] = useState("");
  const [genericName, setGenericName] = useState("");

  const [packageWeight, setPackageWeight] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");

  const [warranty, setWarranty] = useState("");
  const [coveredWarranty, setCoveredWarranty] = useState("");
  const [notCoveredWarranty, setNotCoveredWarranty] = useState("");
  const [warrantyServiceType, setWarrantyServiceType] = useState("");
  const [returnDays, setReturnDays] = useState("7");

  const generatedSku = useMemo(() => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    const cleanCat = selectedCategory?.name
      ? selectedCategory.name.slice(0, 3).toUpperCase()
      : "PRO";

    return `KL-${cleanCat}-${cleanName || "ITEM"}-${Date.now()
      .toString()
      .slice(-5)}`;
  }, [name, selectedCategory]);

  useEffect(() => {
    if (!mainSku) setMainSku(generatedSku);
  }, [generatedSku, mainSku]);

  useEffect(() => {
    async function loadRules() {
      if (!selectedCategory?._id) {
        setRules([]);
        return;
      }

      const res = await fetch(
        `/api/admin/attribute-rules?category_id=${selectedCategory._id}`
      );

      const data = await res.json();
      setRules(data.success ? data.rules || [] : []);
    }

    loadRules();
  }, [selectedCategory]);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error("Upload failed");

    return data.imageUrl || data.url;
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
      setGallery((prev) => [...prev, ...uploaded].slice(0, 5));
      toast.dismiss();
      toast.success("Gallery uploaded");
    } catch {
      toast.dismiss();
      toast.error("Gallery upload failed");
    }
  }

  function validateStep() {
    if (activeStep === 1) {
      if (!name.trim() || !brand.trim() || !selectedCategory?._id) {
        toast.error("Product title, brand and category required");
        return false;
      }
    }

    if (activeStep === 2) {
      for (const rule of rules) {
        if (rule.required && !attributes[rule.fieldKey]) {
          toast.error(`${rule.fieldName} required`);
          return false;
        }
      }
    }

    if (activeStep === 3) {
      if (!mainSku.trim() || !regularPrice || !salePrice || !stock) {
        toast.error("SKU, MRP, selling price and stock required");
        return false;
      }

      if (Number(salePrice) > Number(regularPrice)) {
        toast.error("Selling price cannot be greater than MRP");
        return false;
      }
    }

    if (activeStep === 4 && !mainImage) {
      toast.error("Main image required");
      return false;
    }

    if (activeStep === 6) {
      if (!hsnCode || !gst || !countryOfOrigin || !genericName) {
        toast.error("HSN, GST, country and generic name required");
        return false;
      }
    }

    if (activeStep === 7) {
      if (!packageWeight || !packageLength || !packageWidth || !packageHeight) {
        toast.error("Package weight and dimensions required");
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setActiveStep((prev) => Math.min(prev + 1, 8));
  }

  function prevStep() {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  }

  function resetForm() {
    setActiveStep(1);
    setSelectedCategory(null);
    setCategorySlug("");
    setRules([]);
    setAttributes({});
    setBrand("");
    setBrandVerified(false);
    setName("");
    setModelNumber("");
    setMainSku("");
    setShortDescription("");
    setDescription("");
    setVariants([emptyVariant]);
    setVariationTheme("Color");
    setRegularPrice("");
    setSalePrice("");
    setCostPrice("");
    setStock("");
    setLowStock("");
    setMainImage("");
    setGallery([]);
    setVideoUrl("");
    setHighlights([""]);
    setSearchTags("");
    setHsnCode("");
    setGst("18");
    setCountryOfOrigin("India");
    setManufacturer("");
    setGenericName("");
    setPackageWeight("");
    setPackageLength("");
    setPackageWidth("");
    setPackageHeight("");
    setWarranty("");
    setCoveredWarranty("");
    setNotCoveredWarranty("");
    setWarrantyServiceType("");
    setReturnDays("7");
  }

  async function submitProduct(status: "Draft" | "Pending Approval") {
    if (!validateStep()) return;

    const seller = JSON.parse(localStorage.getItem("seller") || "{}");

    const finalVariants =
      variants.length > 0
        ? variants.map((v: any, index: number) => ({
            colorName: v.colorName || v.color || "",
            colorCode: v.colorCode || "#000000",
            color: v.color || v.colorName || "",
            size: v.size || "",
            sku: String(v.sku || `${mainSku}-V${index + 1}`).trim().toUpperCase(),
            stock: Number(v.stock || 0),
            price: Number(v.price || v.regularPrice || regularPrice || 0),
            regularPrice: Number(v.regularPrice || regularPrice || 0),
            sale_price: Number(v.sale_price || v.salePrice || salePrice || 0),
            salePrice: Number(v.salePrice || v.sale_price || salePrice || 0),
            image:
              v.image ||
              (Array.isArray(v.images) && v.images.length > 0 ? v.images[0] : ""),
            images: Array.isArray(v.images) ? v.images : [],
            isDefault: index === 0,
          }))
        : [];

    const cleanHighlights = highlights.map((x) => x.trim()).filter(Boolean);

    const payload = {
      seller_id: seller?._id || seller?.id || "",
      seller_store_name:
        seller?.storeName || seller?.store_name || "Klassic Seller",

      name,
      title: name,
      brand,
      brandVerified,
      modelNumber,
      sku: mainSku,
      shortDescription,
      short_description: shortDescription,
      description,
      highlights: cleanHighlights,
      features: cleanHighlights,
      tags: searchTags,

      category: selectedCategory?.path?.[0] || selectedCategory?.name || "General",
      sub_category: selectedCategory?.path?.[1] || "",
      subcategory: selectedCategory?.path?.[1] || "",
      leaf_category: selectedCategory?.name || "",
      category_id: selectedCategory?._id || "",
      category_slug: categorySlug || selectedCategory?.slug || "",
      category_path: selectedCategory?.path || [],

      attributes,
      specifications: attributes,
      attributeMeta: rules.map((rule) => ({
        fieldName: rule.fieldName,
        fieldKey: rule.fieldKey,
        fieldType: rule.fieldType,
        filterable: Boolean(rule.filterable),
        searchable: Boolean(rule.searchable),
        showOnProductPage: Boolean(rule.showOnProductPage),
      })),

      variationTheme,
      price: Number(regularPrice || 0),
      regularPrice: Number(regularPrice || 0),
      salePrice: Number(salePrice || 0),
      sale_price: Number(salePrice || 0),
      costPrice: Number(costPrice || 0),
      stock: Number(stock || 0),
      lowStock: Number(lowStock || 0),
      stockStatus: Number(stock || 0) > 0 ? "In Stock" : "Out of Stock",

      image: mainImage,
      gallery_images: gallery,
      videoUrl,

      variants: finalVariants,
      color_variants: finalVariants,
      colors: finalVariants.map((v) => v.colorName).filter(Boolean),

      hsnCode,
      gst: Number(gst || 0),
      countryOfOrigin,
      manufacturer,
      genericName,

      shipping: {
        packageWeight: Number(packageWeight || 0),
        packageLength: Number(packageLength || 0),
        packageWidth: Number(packageWidth || 0),
        packageHeight: Number(packageHeight || 0),
        weightUnit: "kg",
        dimensionUnit: "cm",
      },

      returnPolicy: {
        warranty,
        coveredWarranty,
        notCoveredWarranty,
        warrantyServiceType,
        returnDays: Number(returnDays || 7),
        manufacturer,
        countryOfOrigin,
      },

      warrantySupport: {
        warrantySummary: warranty,
        coveredInWarranty: coveredWarranty,
        notCoveredInWarranty: notCoveredWarranty,
        warrantyServiceType,
        returnDays,
      },

      status,
    };

    try {
      setLoading(true);

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

        resetForm();
      } else {
        toast.error(data.message || "Product submit failed");
      }
    } catch {
      setLoading(false);
      toast.error("Product submit failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-3 md:p-6">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="border-b bg-slate-950 p-5 text-white md:p-7">
          <h1 className="text-2xl font-black md:text-3xl">Add New Product</h1>
          <p className="mt-1 text-sm text-slate-300">
            Professional marketplace listing with universal tabs and dynamic category specifications.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
            {steps.map((item, index) => {
              const stepNo = index + 1;
              const active = activeStep === stepNo;
              const done = activeStep > stepNo;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveStep(stepNo)}
                  className={`rounded-full px-4 py-2 transition ${
                    active
                      ? "bg-blue-500 text-white shadow-lg"
                      : done
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {done ? "✓" : stepNo}. {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[560px] p-5 md:p-8">
          {activeStep === 1 && (
            <Step title="1. Basic Info / Vital Details">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Product Title *" value={name} setValue={setName} />
                <Input label="Brand Name *" value={brand} setValue={setBrand} />
                <Input
                  label="Model Name / Number"
                  value={modelNumber}
                  setValue={setModelNumber}
                />
                <Input
                  label="Short Description"
                  value={shortDescription}
                  setValue={setShortDescription}
                />
                <Toggle
                  label="Brand Verified / GTIN Exemption"
                  value={brandVerified}
                  setValue={setBrandVerified}
                />
              </div>

              <CategorySelector
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setCategorySlug={setCategorySlug}
              />
            </Step>
          )}

          {activeStep === 2 && (
            <Step title="2. Dynamic Category Specifications">
              <p className="text-sm font-semibold text-gray-500">
                Audio, Mobile, Fashion, Footwear, Laptop etc. category ke fields yahan dynamically load honge.
              </p>

              <DynamicAttributeForm
                rules={rules}
                values={attributes}
                setValues={setAttributes}
              />
            </Step>
          )}

          {activeStep === 3 && (
            <Step title="3. Variations & SKUs / Pricing & Stock">
              <div className="grid gap-4 md:grid-cols-3">
                <Select
                  label="Variation Theme"
                  value={variationTheme}
                  setValue={setVariationTheme}
                  options={["Color", "Size", "Color & Size"]}
                  suffix=""
                />
                <Input label="Main SKU *" value={mainSku} setValue={setMainSku} />
                <Input
                  label="MRP *"
                  value={regularPrice}
                  setValue={setRegularPrice}
                  type="number"
                />
                <Input
                  label="Selling Price *"
                  value={salePrice}
                  setValue={setSalePrice}
                  type="number"
                />
                <Input
                  label="Cost Price"
                  value={costPrice}
                  setValue={setCostPrice}
                  type="number"
                />
                <Input
                  label="Stock Quantity *"
                  value={stock}
                  setValue={setStock}
                  type="number"
                />
                <Input
                  label="Low Stock Alert"
                  value={lowStock}
                  setValue={setLowStock}
                  type="number"
                />
              </div>

              <ColorVariantManager
                variants={variants}
                setVariants={setVariants}
                uploadImage={uploadFile}
              />
            </Step>
          )}

          {activeStep === 4 && (
            <Step title="4. Media Gallery / Showcase">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleMainUpload(file);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex min-h-52 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center"
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    className="h-48 rounded-2xl object-contain"
                    alt="Main"
                  />
                ) : (
                  <>
                    <p className="font-black text-blue-800">
                      Upload Main Image *
                    </p>
                    <p className="text-sm text-gray-500">
                      White background, minimum 500x500 recommended.
                    </p>
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

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-gray-700">
                  Gallery Images - Limit 5
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full rounded-2xl border bg-white p-3"
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                />
              </label>

              <Input
                label="Product Video URL"
                value={videoUrl}
                setValue={setVideoUrl}
              />

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {gallery.map((img, i) => (
                  <div key={i} className="rounded-2xl border bg-white p-2">
                    <img
                      src={img}
                      className="h-28 w-full rounded-xl object-contain"
                      alt=""
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setGallery(gallery.filter((_, index) => index !== i))
                      }
                      className="mt-2 w-full rounded-xl bg-red-50 py-2 text-sm font-bold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {activeStep === 5 && (
            <Step title="5. Highlights & Description">
              <div className="rounded-2xl border bg-gray-50 p-4">
                <h3 className="mb-3 font-black">Key Features / Bullet Points</h3>

                <div className="space-y-3">
                  {highlights.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => {
                          const copy = [...highlights];
                          copy[index] = e.target.value;
                          setHighlights(copy);
                        }}
                        placeholder={`Feature ${index + 1}`}
                        className="w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setHighlights(highlights.filter((_, i) => i !== index))
                        }
                        className="rounded-xl bg-red-50 px-4 font-bold text-red-600"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                {highlights.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setHighlights([...highlights, ""])}
                    className="mt-3 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white"
                  >
                    + Add Feature
                  </button>
                )}
              </div>

              <Textarea
                label="Detailed Description"
                value={description}
                setValue={setDescription}
                rows={7}
              />

              <Input
                label="Search Keywords / Tags"
                value={searchTags}
                setValue={setSearchTags}
              />
            </Step>
          )}

          {activeStep === 6 && (
            <Step title="6. Compliance & Legal / Taxation">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="HSN Code *" value={hsnCode} setValue={setHsnCode} />
                <Select
                  label="GST Percentage *"
                  value={gst}
                  setValue={setGst}
                  options={["0", "5", "12", "18", "28"]}
                />
                <Input
                  label="Country Of Origin *"
                  value={countryOfOrigin}
                  setValue={setCountryOfOrigin}
                />
                <Input
                  label="Generic Name *"
                  value={genericName}
                  setValue={setGenericName}
                />
              </div>

              <Textarea
                label="Manufacturer / Importer Name & Address"
                value={manufacturer}
                setValue={setManufacturer}
                rows={5}
              />
            </Step>
          )}

          {activeStep === 7 && (
            <Step title="7. Shipping Logistics">
              <div className="grid gap-4 md:grid-cols-4">
                <Input
                  label="Package Weight KG *"
                  value={packageWeight}
                  setValue={setPackageWeight}
                  type="number"
                />
                <Input
                  label="Length CM *"
                  value={packageLength}
                  setValue={setPackageLength}
                  type="number"
                />
                <Input
                  label="Width CM *"
                  value={packageWidth}
                  setValue={setPackageWidth}
                  type="number"
                />
                <Input
                  label="Height CM *"
                  value={packageHeight}
                  setValue={setPackageHeight}
                  type="number"
                />
              </div>
            </Step>
          )}

          {activeStep === 8 && (
            <Step title="8. Warranty & Support">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label='Warranty Summary'
                  value={warranty}
                  setValue={setWarranty}
                />

                <Select
                  label="Return Policy Days"
                  value={returnDays}
                  setValue={setReturnDays}
                  options={["0", "7", "10"]}
                  suffix=" Days"
                />
              </div>

              <Textarea
                label="Covered in Warranty"
                value={coveredWarranty}
                setValue={setCoveredWarranty}
                rows={4}
              />

              <Textarea
                label="Not Covered in Warranty"
                value={notCoveredWarranty}
                setValue={setNotCoveredWarranty}
                rows={4}
              />

              <Textarea
                label="Warranty Service Type"
                value={warrantyServiceType}
                setValue={setWarrantyServiceType}
                rows={4}
              />
            </Step>
          )}
        </div>

        <div className="flex items-center justify-between border-t bg-gray-50 p-5 md:p-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1}
            className="rounded-xl px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-30"
          >
            Back
          </button>

          <div className="flex gap-3">
            {activeStep === 8 && (
              <button
                type="button"
                disabled={loading}
                onClick={() => submitProduct("Draft")}
                className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
              >
                Save Draft
              </button>
            )}

            {activeStep < 8 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-md hover:bg-blue-700"
              >
                Save & Next
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => submitProduct("Pending Approval")}
                className="rounded-xl bg-green-600 px-8 py-3 font-bold text-white shadow-lg hover:bg-green-700"
              >
                {loading ? "Submitting..." : "Submit Product"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-5 duration-500">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  setValue,
  rows = 3,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
  suffix = "%",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-500"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
            {suffix}
          </option>
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
      className={`rounded-xl border p-3 text-left font-bold ${
        value
          ? "border-green-500 bg-green-50 text-green-700"
          : "border-gray-300 bg-gray-50 text-gray-500"
      }`}
    >
      {label}: {value ? "Yes" : "No"}
    </button>
  );
}