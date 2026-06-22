"use client";

import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CategorySelector from "@/components/seller/CategorySelector";
import ColorVariantManager, {
  ColorVariant,
} from "@/components/seller/ColorVariantManager";

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
  "Vital Info",
  "Category Specs",
  "Variants & SKU",
  "Media Gallery",
  "Description",
  "Compliance",
  "Logistics",
  "Warranty",
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
  const [quantityOptions, setQuantityOptions] = useState([
  { label: "100 g", price: "" },
  { label: "500 g", price: "" },
  { label: "1 kg", price: "" },
  { label: "5 kg", price: "" },
]);
const [showQuantityPricing, setShowQuantityPricing] = useState(true);
const [showSpecifications, setShowSpecifications] = useState(true);

const [productSpecs, setProductSpecs] = useState([
  { key: "Brand", value: "" },
  { key: "Type", value: "" },
  { key: "Sleeve", value: "" },
  { key: "Fit", value: "" },
  { key: "Fabric", value: "" },
  { key: "Pack of", value: "" },
  { key: "Style Code", value: "" },
  { key: "Neck Type", value: "" },
  { key: "Ideal For", value: "" },
  { key: "Size", value: "" },
  { key: "Pattern", value: "" },
  { key: "Suitable For", value: "" },
]);
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
  const isGroceryProduct = useMemo(() => {
  const text = `${selectedCategory?.name || ""} ${
    selectedCategory?.path?.join(" ") || ""
  }`.toLowerCase();

  return (
    text.includes("grocery") ||
    text.includes("food") ||
    text.includes("spice") ||
    text.includes("masala")
  );
}, [selectedCategory]);

const finalStep = isGroceryProduct ? 7 : 8;

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
    if (!selectedCategory) {
      setRules([]);
      setAttributes({});
      return;
    }

    const catName = String(selectedCategory?.name || "").toLowerCase();
    const parentPath = String(selectedCategory?.path?.join(" ") || "").toLowerCase();
    const fullPath = `${catName} ${parentPath}`;

    if (
      fullPath.includes("neckband") ||
      fullPath.includes("audio") ||
      fullPath.includes("earphone") ||
      fullPath.includes("headphone")
    ) {
      setRules([
        { fieldName: "Headphone Type", fieldKey: "headphone_type", fieldType: "dropdown", required: true, options: ["Select...", "In the Ear (Neckband)", "True Wireless (TWS)", "Over the Ear", "Wired in the Ear"], filterable: true, showOnProductPage: true },
        { fieldName: "Connectivity", fieldKey: "connectivity", fieldType: "dropdown", required: true, options: ["Select...", "Bluetooth 5.3", "Bluetooth 5.2", "Bluetooth 5.0", "Wired (3.5mm)"], filterable: true, showOnProductPage: true },
        { fieldName: "Playback Time", fieldKey: "battery_life", fieldType: "text", required: true, placeholder: "e.g. 35 Hours", showOnProductPage: true },
        { fieldName: "With Microphone", fieldKey: "microphone", fieldType: "dropdown", required: true, options: ["Select...", "Yes", "No"], filterable: true, showOnProductPage: true },
        { fieldName: "Water Resistant / IP Rating", fieldKey: "ip_rating", fieldType: "dropdown", required: false, options: ["Select...", "IPX4", "IPX5", "IP55", "IP68", "None"], filterable: true, showOnProductPage: true },
      ]);
    } else if (fullPath.includes("mobile") || fullPath.includes("smartphone")) {
      setRules([
        { fieldName: "RAM", fieldKey: "ram", fieldType: "dropdown", required: true, options: ["Select...", "2GB", "4GB", "6GB", "8GB", "12GB", "16GB"], filterable: true, showOnProductPage: true },
        { fieldName: "Internal Storage", fieldKey: "storage", fieldType: "dropdown", required: true, options: ["Select...", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"], filterable: true, showOnProductPage: true },
        { fieldName: "Processor Brand & Model", fieldKey: "processor", fieldType: "text", required: true, placeholder: "e.g. Snapdragon 8 Gen 2", searchable: true, showOnProductPage: true },
        { fieldName: "Battery Capacity", fieldKey: "battery", fieldType: "text", required: true, placeholder: "e.g. 5000 mAh", showOnProductPage: true },
        { fieldName: "Network Support", fieldKey: "network", fieldType: "dropdown", required: true, options: ["Select...", "5G", "4G VoLTE", "4G LTE"], filterable: true, showOnProductPage: true },
        { fieldName: "Screen Size", fieldKey: "screen_size", fieldType: "text", required: false, placeholder: "e.g. 6.7 inch AMOLED", showOnProductPage: true },
      ]);
    } else if (
      fullPath.includes("grocery") ||
      fullPath.includes("food") ||
      fullPath.includes("spice") ||
      fullPath.includes("masala")
    ) {
      setRules([
        { fieldName: "FSSAI License Number", fieldKey: "fssai", fieldType: "text", required: false, placeholder: "Enter 14-digit FSSAI number", showOnProductPage: true },
        { fieldName: "Maximum Shelf Life", fieldKey: "shelf_life", fieldType: "text", required: true, placeholder: "e.g. 12 Months", showOnProductPage: true },
        { fieldName: "Diet Type", fieldKey: "diet_type", fieldType: "dropdown", required: false, options: ["Select...", "Vegetarian", "Non-Vegetarian", "Vegan", "Eggitarian"], filterable: true, showOnProductPage: true },
        { fieldName: "Food Type", fieldKey: "food_type", fieldType: "dropdown", required: false, options: ["Select...", "Whole Spices", "Powder Spices", "Blended Masala", "Ready Mix"], filterable: true, showOnProductPage: true },
      ]);
    } else if (
      fullPath.includes("fashion") ||
      fullPath.includes("clothing") ||
      fullPath.includes("shirt") ||
      fullPath.includes("wear")
    ) {
      setRules([
        { fieldName: "Fabric", fieldKey: "fabric", fieldType: "dropdown", required: true, options: ["Select...", "Cotton", "Polyester", "Silk", "Denim", "Linen", "Wool", "Blend"], filterable: true, showOnProductPage: true },
        { fieldName: "Fit Type", fieldKey: "fit_type", fieldType: "dropdown", required: true, options: ["Select...", "Regular Fit", "Slim Fit", "Relaxed Fit", "Oversized"], filterable: true, showOnProductPage: true },
        { fieldName: "Pattern", fieldKey: "pattern", fieldType: "dropdown", required: false, options: ["Select...", "Solid", "Printed", "Striped", "Checked", "Floral"], filterable: true, showOnProductPage: true },
        { fieldName: "Wash Care", fieldKey: "wash_care", fieldType: "text", required: false, placeholder: "e.g. Machine wash cold", showOnProductPage: true },
      ]);
    } else {
      setRules([
        { fieldName: "Material / Composition", fieldKey: "material", fieldType: "text", required: false, placeholder: "Primary material", showOnProductPage: true },
        { fieldName: "Key Feature", fieldKey: "key_feature", fieldType: "text", required: false, placeholder: "Main highlight of the product", showOnProductPage: true },
      ]);
    }

    setAttributes({});
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
        const key =
  rule.fieldKey ||
  rule.fieldName?.toLowerCase().replace(/[^a-z0-9]+/g, "_");

const value = attributes[key];

        if (
          rule.required &&
          (!value ||
            value === "Select..." ||
            (Array.isArray(value) && value.length === 0))
        ) {
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
    setActiveStep((prev) => Math.min(prev + 1, finalStep));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setActiveStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setShowQuantityPricing(true);
    setShowSpecifications(true);
setProductSpecs([
  { key: "Brand", value: "" },
  { key: "Type", value: "" },
  { key: "Sleeve", value: "" },
  { key: "Fit", value: "" },
  { key: "Fabric", value: "" },
  { key: "Pack of", value: "" },
  { key: "Style Code", value: "" },
  { key: "Neck Type", value: "" },
  { key: "Ideal For", value: "" },
  { key: "Size", value: "" },
  { key: "Pattern", value: "" },
  { key: "Suitable For", value: "" },
]);
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
      tags: searchTags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),

      category: selectedCategory?.path?.[0] || selectedCategory?.name || "General",
      sub_category: selectedCategory?.path?.[1] || "",
      subcategory: selectedCategory?.path?.[1] || "",
      leaf_category: selectedCategory?.name || "",
      category_id: selectedCategory?._id || "",
      category_slug: categorySlug || selectedCategory?.slug || "",
      category_path: selectedCategory?.path || [],

      attributes,
      showSpecifications,

specifications: showSpecifications
  ? [
      ...Object.entries(attributes || {}).map(([key, value]) => ({
        key,
        value,
      })),
      ...productSpecs.filter((x) => x.key && x.value),
    ]
  : [],
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
      images: [mainImage, ...gallery].filter(Boolean),
      videoUrl,

      variants: finalVariants,
      color_variants: finalVariants,
      colors: finalVariants.map((v) => v.colorName).filter(Boolean),

      quantityOptions: quantityOptions.map((x) => x.label),

showQuantityPricing,

quantityPrices: isGroceryProduct
  ? quantityOptions.map((x) => ({
      label: x.label,
      price: Number(x.price || 0),
    }))
  : [],


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

      if (res.ok && data.success) {
        toast.success(
          status === "Draft"
            ? "Product saved as draft"
            : "Product sent for approval"
        );

        resetForm();
        window.location.href = "/seller/products";
      } else {
        toast.error(data.message || "Product submit failed");
      }
    } catch {
      toast.error("Product submit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-3 py-4 font-sans text-gray-900 md:px-6 md:py-6">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-5xl overflow-hidden rounded-[1.6rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
        <div className="bg-neutral-950 px-5 py-6 text-white md:px-8">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            List New Product
          </h1>
          <p className="mt-1 text-xs font-medium text-neutral-400 md:text-sm">
            Smart dynamic seller form with category based specifications.
          </p>

          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
            {steps
  .filter((item) => !(isGroceryProduct && item === "Warranty"))
  .map((item, index) => {
              const stepNo = index + 1;
              const active = activeStep === stepNo;
              const done = activeStep > stepNo;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (done || active) setActiveStep(stepNo);
                  }}
                  disabled={!done && !active}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition ${
                    active
                      ? "bg-white text-black"
                      : done
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "cursor-not-allowed bg-neutral-900 text-neutral-600"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      active
                        ? "bg-black text-white"
                        : done
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-800"
                    }`}
                  >
                    {done ? "✓" : stepNo}
                  </span>
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[460px] px-5 py-6 md:px-8">
          {activeStep === 1 && (
            <Step title="Basic Information" subtitle="Product title, brand and category hierarchy.">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Product Title *" placeholder="e.g. Sony WH-1000XM5" value={name} setValue={setName} />
                <Input label="Brand Name *" placeholder="e.g. Sony" value={brand} setValue={setBrand} />
                <Input label="Model Name / Number" placeholder="e.g. WH1000XM5/B" value={modelNumber} setValue={setModelNumber} />
                <Input label="Short Description" placeholder="Brief 1-line summary" value={shortDescription} setValue={setShortDescription} />

                <div className="md:col-span-2">
                  <Toggle label="Brand Verified / GTIN Exemption" value={brandVerified} setValue={setBrandVerified} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5">
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-600">
                  Select Category Hierarchy *
                </h3>
                <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setCategorySlug={setCategorySlug} />
              </div>
            </Step>
          )}

          {activeStep === 2 && (
            <Step title="Category Specifications" subtitle="Fields auto-change based on selected category.">
              {!selectedCategory?._id ? (
                <EmptyBox icon="📂" title="No Category Selected" text="Go back to Step 1 and select a leaf category first." />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <CategoryDynamicFields rules={rules} values={attributes} setValues={setAttributes} />
                </div>
              )}
            </Step>
          )}

          {activeStep === 3 && (
            <Step title="Variations & SKU" subtitle="Pricing, inventory and child variants.">
              <div className="mb-6 grid gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 md:grid-cols-3">
                <Select label="Variation Theme" value={variationTheme} setValue={setVariationTheme} options={["Color", "Size", "Color & Size"]} suffix="" />
                <Input label="Main SKU *" value={mainSku} setValue={setMainSku} />
                <Input label="MRP ₹ *" value={regularPrice} setValue={setRegularPrice} type="number" />
                <Input label="Selling Price ₹ *" value={salePrice} setValue={setSalePrice} type="number" />
                <Input label="Cost Price ₹" value={costPrice} setValue={setCostPrice} type="number" />
                <Input label="Stock Quantity *" value={stock} setValue={setStock} type="number" />
                <Input label="Low Stock Alert" value={lowStock} setValue={setLowStock} type="number" />
              </div>
<div className="mb-6 rounded-2xl border p-4">
  <label className="flex items-center gap-3 font-bold">
    <input
      type="checkbox"
      checked={showQuantityPricing}
      onChange={(e) =>
        setShowQuantityPricing(e.target.checked)
      }
      
    />

    Show Size / Weight Options On Product Page
  </label>
</div>

{isGroceryProduct && (
  <div className="mb-6 rounded-2xl border p-5">
    <h3 className="mb-4 font-bold">
      Quantity Wise Pricing
    </h3>

    <div className="space-y-3">
      {quantityOptions.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3"
        >
          <input
            value={item.label}
            onChange={(e) => {
              const copy = [...quantityOptions];
              copy[index].label = e.target.value;
              setQuantityOptions(copy);
            }}
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => {
              const copy = [...quantityOptions];
              copy[index].price = e.target.value;
              setQuantityOptions(copy);
            }}
            className="border p-3 rounded-xl"
          />
        </div>
      ))}
    </div>
  </div>
)}

              <ColorVariantManager variants={variants} setVariants={setVariants} uploadImage={uploadFile} />
            </Step>
          )}

          {activeStep === 4 && (
            <Step title="Media Showcase" subtitle="Upload main image, gallery and video.">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleMainUpload(file);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="relative flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-black"
              >
                {mainImage ? (
                  <img src={mainImage} className="h-48 w-full rounded-2xl object-contain" alt="Main" />
                ) : (
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">📸</div>
                    <p className="font-black text-gray-900">Drag & Drop Main Image *</p>
                    <p className="mt-1 text-xs text-gray-500">White background, 1000x1000 recommended.</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMainUpload(file);
                  }}
                />
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-500">
                    Gallery Images Max 5
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                  />
                </label>

                <Input label="Product Video URL" placeholder="https://..." value={videoUrl} setValue={setVideoUrl} />
              </div>
            </Step>
          )}

          {activeStep === 5 && (
            <Step title="Highlights & Description" subtitle="Customer facing details.">
              <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-500">
                  Key Features
                </h3>

                <div className="space-y-3">
                  {highlights.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-black" />
                      <input
                        value={item}
                        onChange={(e) => {
                          const copy = [...highlights];
                          copy[index] = e.target.value;
                          setHighlights(copy);
                        }}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 border-b border-gray-200 bg-transparent py-2 text-sm outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                        className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                {highlights.length < 5 && (
                  <button type="button" onClick={() => setHighlights([...highlights, ""])} className="mt-4 text-sm font-black text-blue-600">
                    + Add Feature
                  </button>
                )}
              </div>
<div className="mb-6 rounded-2xl border p-4">
  <label className="flex items-center gap-3 font-bold">
    <input
      type="checkbox"
      checked={showSpecifications}
      onChange={(e) => setShowSpecifications(e.target.checked)}
    />
    Show Specifications On Product Page
  </label>
</div>

{showSpecifications && (
  <div className="mb-6 rounded-2xl border p-5">
    <h3 className="mb-4 font-bold">Product Specifications</h3>

    <div className="space-y-3">
      {productSpecs.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3">
          <input
            value={item.key}
            onChange={(e) => {
              const copy = [...productSpecs];
              copy[index].key = e.target.value;
              setProductSpecs(copy);
            }}
            className="rounded-xl border p-3"
          />

          <input
            value={item.value}
            placeholder="Value"
            onChange={(e) => {
              const copy = [...productSpecs];
              copy[index].value = e.target.value;
              setProductSpecs(copy);
            }}
            className="rounded-xl border p-3"
          />
        </div>
      ))}
    </div>
  </div>
)}
              <div className="space-y-5">
                <Textarea label="Detailed Description" value={description} setValue={setDescription} rows={5} />
                <Input label="Search Keywords / Tags" placeholder="wireless, headphones, premium..." value={searchTags} setValue={setSearchTags} />
              </div>
            </Step>
          )}

          {activeStep === 6 && (
            <Step title="Compliance & Legal" subtitle="Tax and legal product details.">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="HSN Code *" value={hsnCode} setValue={setHsnCode} />
                <Select label="GST Percentage *" value={gst} setValue={setGst} options={["0", "5", "12", "18", "28"]} />
                <Input label="Country Of Origin *" value={countryOfOrigin} setValue={setCountryOfOrigin} />
                <Input label="Generic Name *" value={genericName} setValue={setGenericName} />
              </div>

              <div className="mt-5">
                <Textarea label="Manufacturer / Importer Name & Address" value={manufacturer} setValue={setManufacturer} rows={4} />
              </div>
            </Step>
          )}

          {activeStep === 7 && (
            <Step title="Shipping Logistics" subtitle="Package size and weight.">
              <div className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-4">
                <Input label="Weight KG *" placeholder="0.5" value={packageWeight} setValue={setPackageWeight} type="number" />
                <Input label="Length CM *" placeholder="20" value={packageLength} setValue={setPackageLength} type="number" />
                <Input label="Width CM *" placeholder="15" value={packageWidth} setValue={setPackageWidth} type="number" />
                <Input label="Height CM *" placeholder="10" value={packageHeight} setValue={setPackageHeight} type="number" />
              </div>
            </Step>
          )}

          {activeStep === finalStep&& (
            <Step title="Warranty & Support" subtitle="Return and support policy.">
              <div className="mb-5 grid gap-5 md:grid-cols-2">
                <Input label="Warranty Summary" placeholder="e.g. 1 Year Brand Warranty" value={warranty} setValue={setWarranty} />
                <Select label="Return Policy Days" value={returnDays} setValue={setReturnDays} options={["0", "7", "10", "15", "30"]} suffix=" Days" />
              </div>

              <div className="space-y-5">
                <Textarea label="Covered in Warranty" placeholder="Manufacturing defects..." value={coveredWarranty} setValue={setCoveredWarranty} rows={3} />
                <Textarea label="Not Covered in Warranty" placeholder="Physical damage..." value={notCoveredWarranty} setValue={setNotCoveredWarranty} rows={3} />
                <Textarea label="Warranty Service Type" placeholder="Carry-in, On-site..." value={warrantyServiceType} setValue={setWarrantyServiceType} rows={3} />
              </div>
            </Step>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-5 py-4 md:px-8">
          <button type="button" onClick={prevStep} disabled={activeStep === 1} className="rounded-full px-5 py-2 text-sm font-black text-gray-500 transition hover:bg-gray-100 disabled:opacity-0">
            ← Back
          </button>

          <div className="flex gap-3">
            {activeStep === 8 && (
              <button type="button" disabled={loading} onClick={() => submitProduct("Draft")} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-black shadow-sm hover:bg-gray-50">
                Save Draft
              </button>
            )}

            {activeStep < finalStep ? (
              <button type="button" onClick={nextStep} className="rounded-full bg-black px-7 py-2.5 text-sm font-black text-white shadow-md hover:bg-neutral-800">
                Save & Continue →
              </button>
            ) : (
              <button type="button" disabled={loading} onClick={() => submitProduct("Pending Approval")} className="rounded-full bg-blue-600 px-7 py-2.5 text-sm font-black text-white shadow-md hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Submitting..." : "Submit for Approval ✓"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-gray-900 md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, setValue, type = "text", placeholder = "" }: { label: string; value: string; setValue: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black" />
    </label>
  );
}

function Textarea({ label, value, setValue, rows = 3, placeholder = "" }: { label: string; value: string; setValue: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-500">{label}</span>
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black" />
    </label>
  );
}

function Select({ label, value, setValue, options, suffix = "%" }: { label: string; value: string; setValue: (v: string) => void; options: string[]; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-500">{label}</span>
      <select value={value || "Select..."} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black">
        {options.map((item) => (
          <option key={item} value={item} disabled={item === "Select..."}>
            {item}
            {suffix}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, value, setValue }: { label: string; value: boolean; setValue: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
      <span className="text-sm font-black text-gray-700">{label}</span>
      <button type="button" onClick={() => setValue(!value)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${value ? "bg-black" : "bg-gray-200"}`}>
        <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function EmptyBox({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-14 text-center">
      <span className="mb-3 text-4xl">{icon}</span>
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{text}</p>
    </div>
  );
}

function CategoryDynamicFields({ rules, values, setValues }: { rules: Rule[]; values: Record<string, any>; setValues: (values: Record<string, any>) => void }) {
  function updateValue(key: string, value: any) {
    setValues({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {rules.map((rule, index) => {
        const safeKey =
  rule.fieldKey ||
  rule.fieldName?.toLowerCase().replace(/[^a-z0-9]+/g, "_") ||
  rule._id ||
  `rule_${index}`;

        const type = String(rule.fieldType || "text").toLowerCase();
        const label = `${rule.fieldName || "Specification"}${rule.required ? " *" : ""}`;

        if (type === "dropdown" || type === "radio") {
          return (
            <Select key={safeKey} label={label} options={rule.options?.length ? rule.options : ["Select..."]} value={values[safeKey] || ""} setValue={(val) => updateValue(safeKey, val)} suffix="" />
          );
        }

        return (
          <Input key={safeKey} label={label} type={type === "number" ? "number" : "text"} placeholder={rule.placeholder || ""} value={values[safeKey] || ""} setValue={(val) => updateValue(safeKey, val)} />
        );
      })}
    </div>
  );
}