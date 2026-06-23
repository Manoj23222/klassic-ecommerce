"use client";

import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductSpecifications from "@/components/ProductSpecifications";

type Variant = {
  color?: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  sku?: string;
  price?: number | string;
  sale_price?: number | string;
  salePrice?: number | string;
  regularPrice?: number | string;
  stock?: number | string;
  image?: string;
  images?: string[];
  isDefault?: boolean;
};

export default function ProductPageClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [buyQty, setBuyQty] = useState(1);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("delivery");
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const productId = String(product.id || product._id || "");

  const variants: Variant[] = useMemo(() => {
    const dbVariants =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants
        : Array.isArray(product.color_variants) &&
          product.color_variants.length > 0
        ? product.color_variants
        : [];

    if (dbVariants.length > 0) {
      return dbVariants.map((v: Variant) => ({
        ...v,
        colorName: v.colorName || v.color || "Color",
        color: v.color || v.colorName || "Color",
        sku: v.sku || product.sku,
        price: v.price || product.price,
        sale_price: v.sale_price || v.salePrice || product.sale_price,
        salePrice: v.salePrice || v.sale_price || product.salePrice,
        regularPrice: v.regularPrice || product.regularPrice || product.price,
        stock: v.stock ?? product.stock,
        image:
          v.image ||
          (Array.isArray(v.images) && v.images.length > 0
            ? v.images[0]
            : "") ||
          product.image,
        images:
          Array.isArray(v.images) && v.images.length > 0
            ? v.images
            : v.image
            ? [v.image]
            : product.image
            ? [product.image]
            : [],
      }));
    }

    return [
      {
        colorName: "Default",
        color: "Default",
        sku: product.sku,
        price: product.price,
        sale_price: product.sale_price || product.salePrice,
        salePrice: product.salePrice || product.sale_price,
        regularPrice: product.regularPrice || product.price,
        stock: product.stock,
        image: product.image,
        images: [product.image, ...(product.gallery_images || [])].filter(
          Boolean
        ),
      },
    ];
  }, [product]);

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0] || null;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    defaultVariant
  );

  useEffect(() => {
    setSelectedVariant(defaultVariant);
  }, [defaultVariant]);

  const images = useMemo(() => {
    const variantImages = [
      selectedVariant?.image,
      ...(Array.isArray(selectedVariant?.images)
        ? selectedVariant.images
        : []),
    ].filter(Boolean) as string[];

    const productImages = [
      product.image,
      ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter(Boolean) as string[];

    return Array.from(
      new Set(variantImages.length > 0 ? variantImages : productImages)
    );
  }, [selectedVariant, product]);

  const [selectedImage, setSelectedImage] = useState(
    images[0] || product.image || "/placeholder.png"
  );

  useEffect(() => {
    setSelectedImage(images[0] || product.image || "/placeholder.png");
  }, [images, product.image]);

  const quantityPriceMap = useMemo(() => {
    
    if (!Array.isArray(product.quantityPrices)) return {};

    return product.quantityPrices.reduce(
      (acc: Record<string, number>, item: any) => {
        if (item?.label) {
          acc[String(item.label).trim()] = Number(item.price || 0);
        }
        return acc;
      },
      {}
    );
  }, [product.quantityPrices]);

  const basePrice = Number(
    selectedVariant?.sale_price ||
      selectedVariant?.salePrice ||
      selectedVariant?.price ||
      product.sale_price ||
      product.salePrice ||
      product.price ||
      0
  );

  const isGroceryProduct =
  String(product.category || "").toLowerCase().includes("grocery") ||
  String(product.sub_category || "").toLowerCase().includes("grocery") ||
  String(product.subcategory || "").toLowerCase().includes("grocery");

const selectedQtyPrice =
  selectedQuantity && quantityPriceMap[String(selectedQuantity)] !== undefined
    ? Number(quantityPriceMap[String(selectedQuantity)])
    : null;

const price =
  selectedQtyPrice !== null && selectedQtyPrice > 0
  
    ? selectedQtyPrice
    : basePrice;

  const mrp =
    isGroceryProduct &&
    selectedQuantity &&
    quantityPriceMap[String(selectedQuantity)]
      ? Math.round(price * 1.15)
      : Number(
          selectedVariant?.regularPrice ||
            product.regularPrice ||
            selectedVariant?.price ||
            product.price ||
            price
        );

  const finalMrp = mrp > price ? mrp : Math.round(price * 1.25);

  const discount =
    finalMrp > price ? Math.round(((finalMrp - price) / finalMrp) * 100) : 0;

  const stock = Number(selectedVariant?.stock ?? product.stock ?? 0);
  const selectedColor =
    selectedVariant?.colorName || selectedVariant?.color || "Default";
  const selectedSku = selectedVariant?.sku || product.sku || "N/A";

  const nameQuantityMatch = String(product.name || "").match(
    /\((\d+\s*(g|gm|kg|ml|l|ltr))\)/i
  );

  const singleProductQuantity = nameQuantityMatch
    ? [nameQuantityMatch[1].replace(/\s+/g, " ")]
    : [];

  const quantityOptions =
    Array.isArray(product.quantityOptions) && product.quantityOptions.length > 0
      ? product.quantityOptions
      : Array.isArray(product.quantities) && product.quantities.length > 0
      ? product.quantities
      : Array.isArray(product.weightOptions) && product.weightOptions.length > 0
      ? product.weightOptions
      : singleProductQuantity;

  const showQuantitySelector =
  product.showQuantityPricing !== false && quantityOptions.length > 0;

  useEffect(() => {
    if (showQuantitySelector && !selectedQuantity) {
      setSelectedQuantity(String(quantityOptions[0]));
    }
  }, [showQuantitySelector, quantityOptions, selectedQuantity]);

  const hasRealColor =
    variants.length > 0 &&
    selectedColor &&
    selectedColor !== "Default" &&
    selectedColor !== "Color";

  const isTextVariant = product.variationTheme === "Size" || product.variationTheme === "Weight";

  const totalPrice = price * buyQty;

  const cartItem = {
    _id: productId,
    id: productId,
    name: product.name,
    price: totalPrice,
    unitPrice: price,
    selectedPrice: price,
    buyQty,
    quantity: buyQty,
    selectedQuantity: selectedQuantity || "",
    packQuantity: selectedQuantity || "",
    image: selectedImage || product.image || "/placeholder.png",
    sku: selectedSku,
    color: selectedColor,
    stock,
  };

  function addToCart() {
    if (stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = oldCart.findIndex(
      (item: any) =>
        String(item.id || item._id) === productId &&
        String(item.sku || "") === String(selectedSku || "") &&
        String(item.selectedQuantity || item.packQuantity || "") ===
          String(selectedQuantity || "")
    );

    let newCart = [...oldCart];

    if (existingIndex >= 0) {
      const oldQty = Number(newCart[existingIndex].buyQty || newCart[existingIndex].quantity || 1);
      const newQty = oldQty + buyQty;

      newCart[existingIndex] = {
        ...newCart[existingIndex],
        ...cartItem,
        buyQty: newQty,
        quantity: newQty,
        price: price * newQty,
      };
    } else {
      newCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  }

  function buyNow() {
    if (stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    const user = localStorage.getItem("user");

    localStorage.setItem("buyNowItem", JSON.stringify(cartItem));

    if (!user) {
   router.push(
  `/login?redirect=${encodeURIComponent(
    `/checkout?buyNow=1` +
      `&productId=${productId}` +
      `&color=${selectedColor || ""}` +
      `&quantity=${selectedQuantity || ""}` +
      `&price=${price}` +
      `&qty=${buyQty}`
  )}`
);
      return;
    }

    router.push(
  `/checkout?buyNow=1` +
    `&productId=${productId}` +
    `&color=${encodeURIComponent(selectedColor || "")}` +
    `&quantity=${encodeURIComponent(selectedQuantity || "")}` +
    `&price=${price}` +
    `&qty=${buyQty}`
);
  }

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [questionName, setQuestionName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  function checkPincode() {
    const clean = pincode.trim();

    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPincodeMessage("❌ Enter valid 6 digit Indian pincode");
      return;
    }

    setPincodeMessage("✅ Delivery available • COD available • Easy returns");
  }

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      }
    }

    if (productId) loadReviews();
  }, [productId]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(`/api/questions?productId=${productId}`);
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch {
        setQuestions([]);
      }
    }

    if (productId) loadQuestions();
  }, [productId]);

  const approvedReviews = reviews.filter((r) => r.status === "Approved");

  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        approvedReviews.length
      : 0;

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!reviewName || !reviewComment) {
      toast.error("Name and comment required");
      return;
    }

    setReviewLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      }),
    });

    const data = await res.json();
    setReviewLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Review failed");
      return;
    }

    toast.success("Review submitted");
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);

    const reload = await fetch(`/api/reviews?productId=${productId}`);
    const newData = await reload.json();
    setReviews(Array.isArray(newData) ? newData : []);
  }

  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault();

    if (!questionName || !questionText) {
      toast.error("Name and question required");
      return;
    }

    setQuestionLoading(true);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        name: questionName,
        question: questionText,
      }),
    });

    const data = await res.json();
    setQuestionLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Question failed");
      return;
    }

    toast.success("Question submitted");
    setQuestionName("");
    setQuestionText("");

    const reload = await fetch(`/api/questions?productId=${productId}`);
    const newData = await reload.json();
    setQuestions(Array.isArray(newData) ? newData : []);
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20">
      <Header />

      <section className="mx-auto max-w-[1450px] px-2 py-3 sm:px-4">
        <div className="mb-2 text-[11px] font-bold text-blue-600 sm:text-sm">
          Home / {product.category} / {product.name}
        </div>

        <div className="grid gap-5 lg:grid-cols-[55%_45%]">
          {/* LEFT SECTION (IMAGES & BUTTONS) */}
          <section className="rounded-[2rem] bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-4 lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
              <div className="flex gap-4 overflow-x-auto sm:max-h-[420px] sm:flex-col">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-1 sm:h-20 sm:w-20 ${
                      selectedImage === img
                        ? "border-black ring-1 ring-black ring-offset-2"
                        : "border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full rounded-md object-contain" />
                  </button>
                ))}
              </div>

              <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl bg-[#f8f9fa] p-4 sm:min-h-[520px]">
                <img
                  src={selectedImage || product.image || "/placeholder.png"}
                  alt={product.name}
                  className="max-h-[260px] w-full object-contain transition duration-500 hover:scale-105 sm:max-h-[500px]"
                />
              </div>
            </div>

            <div className="mt-3 hidden grid-cols-2 gap-2 sm:grid">
              <button
                type="button"
                onClick={addToCart}
                disabled={stock <= 0}
                className={`rounded-full py-3 text-center text-sm font-black ${
                  stock > 0 ? "bg-black text-white hover:bg-neutral-800 transition" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add To Cart
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={stock <= 0}
                className={`rounded-full py-3 text-center text-sm font-black ${
                  stock > 0 ? "bg-yellow-400 text-black hover:bg-yellow-500 transition" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>
          </section>

          {/* RIGHT SECTION (DETAILS) */}
          <section className="max-h-none space-y-3 lg:max-h-[calc(135vh-180px)] lg:overflow-y-auto lg:pr-2">
            <Card>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {product.brand || product.category}
              </p>

              <h1 className="mt-1 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl text-gray-900">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-green-600 px-2 py-1 text-[11px] font-black text-white">
                  {avgRating ? avgRating.toFixed(1) : "0.0"} ★
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {approvedReviews.length > 0
                    ? `${approvedReviews.length} Ratings`
                    : "No ratings yet"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-3 border-b border-gray-100 pb-4">
                <p className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                  ₹{price.toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-gray-400 line-through sm:text-lg mb-1">
                  ₹{finalMrp.toFixed(2)}
                </p>
                <p className="text-sm font-black text-green-600 mb-1">{discount}% off</p>
              </div>

              {/* ========================================= */}
              {/* 🌟 1. SIZE / WEIGHT SELECTOR (Text Pills)  */}
              {/* ========================================= */}
              {showQuantitySelector && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-bold text-gray-700">
                    Selected Size / Weight:
                    <span className="ml-2 text-black">{selectedQuantity}</span>
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {quantityOptions.map((qty: string) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setSelectedQuantity(String(qty).trim())}
                        className={`shrink-0 rounded-lg border px-5 py-2.5 text-sm font-bold transition-all ${
                          selectedQuantity === String(qty)
                            ? "border-black bg-black text-white shadow-md"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 🌟 2. COLOR SELECTOR (Image Thumbnails)    */}
              {/* ========================================= */}
              {hasRealColor && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-gray-700">
                      Select {product.variationTheme || "Color"}: 
                      <span className="ml-2 text-black">{selectedColor}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pb-1">
                    {variants.map((v, i) => {
                      const active = selectedVariant?.sku === v.sku || selectedVariant === v;
                      const isOutOfStock = Number(v.stock) <= 0;

                      const img =
                        v.image ||
                        (Array.isArray(v.images) && v.images.length > 0
                          ? v.images[0]
                          : "") ||
                        product.image ||
                        "/placeholder.png";

                      // Agar variation theme Size/Weight hai toh isko bhi Text Pill banayenge (Fallback)
                      if (isTextVariant) {
                        return (
                          <button
                            key={v.sku || `${v.size}-${i}`}
                            disabled={isOutOfStock}
                            onClick={() => { setSelectedVariant(v); setSelectedImage(img); }}
                            className={`relative rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                              active
                                ? "border-2 border-black bg-black text-white shadow-md"
                                : "border border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                            } ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                          >
                            {v.size || v.colorName}
                          </button>
                        );
                      }

                      // Normal Color Thumbnails
                      return (
                        <button
                          key={v.sku || `${v.colorName}-${i}`}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedVariant(v);
                            setSelectedImage(img);
                          }}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition-all ${
                            active
                              ? "border-blue-600 ring-1 ring-blue-600 shadow-sm"
                              : "border-gray-200 hover:border-gray-400"
                          } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <img
                            src={img}
                            alt={v.colorName || "Color"}
                            className="h-full w-full rounded-md object-contain"
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-md">
                              <span className="bg-white px-1 text-[9px] font-black uppercase text-red-600 border border-red-200">Out</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 📦 3. QUANTITY MANIPULATOR (- 1 +)         */}
              {/* ========================================= */}
              <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center">
                  <span className="mr-4 text-sm font-bold text-gray-700">Qty:</span>
                  <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBuyQty((p) => Math.max(1, p - 1))}
                      className="flex h-full w-11 items-center justify-center text-xl font-black text-gray-600 transition hover:bg-gray-100 hover:text-black"
                    >
                      −
                    </button>

                    <span className="flex h-full min-w-[3rem] items-center justify-center border-x border-gray-200 text-sm font-black text-black">
                      {buyQty}
                    </span>

                    <button
                      type="button"
                      onClick={() => setBuyQty((p) => Math.min(stock || 99, p + 1))}
                      className={`flex h-full w-11 items-center justify-center text-xl font-black transition ${
                        buyQty >= stock ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Price</span>
                  <span className="text-xl font-black text-green-700">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* PRODUCT META */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-600 sm:text-sm">
                <div>
                  <p className="mb-1">
                    SKU: <b className="text-gray-900">{selectedSku}</b>
                  </p>
                  <p
                    className={
                      stock > 0
                        ? "font-black text-green-600"
                        : "font-black text-red-600"
                    }
                  >
                    {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <SectionButton
  title="Delivery Information"
  subtitle="Delivery options, COD and returns"
  section="delivery"
  openSection={openSection}
  toggleSection={toggleSection}
/>

              {openSection === "delivery" && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter Pincode"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, ""));
                        setPincodeMessage("");
                      }}
                      className="flex-1 rounded-xl border p-3 text-sm font-bold outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={checkPincode}
                      className="rounded-xl bg-black px-5 text-sm font-black text-white"
                    >
                      Check
                    </button>
                  </div>

                  {pincodeMessage && (
                    <p
                      className={`mt-2 text-sm font-bold ${
                        pincodeMessage.includes("✅")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {pincodeMessage}
                    </p>
                  )}

                  <div className="mt-3 space-y-1 text-sm font-medium text-gray-700">
                    <p>✓ Free Delivery Available</p>
                    <p>✓ Cash On Delivery</p>
                    <p>✓ Easy Returns</p>
                  </div>
                </>
              )}
            </Card>

            <Card>
              <SectionButton
  title="Trust & Assurance"
  subtitle="Secure shopping and buyer protection"
  section="trust"
  openSection={openSection}
  toggleSection={toggleSection}
/>

              {openSection === "trust" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                    <p className="text-2xl">✔</p>
                    <p className="mt-2 font-black text-green-900">Genuine Product</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                    <p className="text-2xl">🚚</p>
                    <p className="mt-2 font-black text-blue-900">Fast Delivery</p>
                  </div>
                  <div className="rounded-2xl bg-yellow-50 p-4 border border-yellow-100">
                    <p className="text-2xl">↩</p>
                    <p className="mt-2 font-black text-yellow-900">Easy Returns</p>
                  </div>
                  <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100">
                    <p className="text-2xl">🔒</p>
                    <p className="mt-2 font-black text-purple-900">Secure Payment</p>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <SectionButton
  title="Product Highlights"
  subtitle="Key features, specifications and more"
  section="highlights"
  openSection={openSection}
  toggleSection={toggleSection}
/>

              {openSection === "highlights" && (
                <>
                  {Array.isArray(product.features) && product.features.length > 0 ? (
                    <ul className="space-y-2 text-sm font-medium text-gray-700">
                      {product.features.map((f: string, i: number) => (
                        <li key={i} className="flex gap-2"><span className="text-green-600 font-bold">✓</span> {f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Premium quality product with trusted Klassic marketplace
                      assurance.
                    </p>
                  )}
                </>
              )}
            </Card>

            <Card>
              <SectionButton
  title="All Details"
  subtitle="Features, description and more"
  section="details"
  openSection={openSection}
  toggleSection={toggleSection}
/>

              {openSection === "details" && (
                <>
                  <div className="overflow-x-auto border-b border-gray-300">
                    <div className="flex min-w-max gap-8 text-sm font-bold tracking-tight">
                      {[
                        "showcase",
                        "specifications",
                        "description",
                        "manufacturer",
                      ].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            if (tab === "showcase") {
                              setShowcaseOpen(true);
                              return;
                            }

                            setActiveTab(tab);
                          }}
                          className={`pb-2 text-sm capitalize transition ${
                            activeTab === tab
                              ? "border-b-2 border-black text-black"
                              : "text-gray-500 hover:text-black"
                          }`}
                        >
                          {tab === "manufacturer" ? "Manufacturer Info" : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "description" && (
                    <div className="mt-4 text-sm leading-7 text-gray-800">
                      {product.description || "No description available"}
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div className="mt-4">
                      <ProductSpecifications
                        product={{
                          ...product,
                          sku: selectedSku,
                          default_variant_sku: selectedSku,
                          color: selectedColor,
                          stock,
                          size: selectedQuantity,
                        }}
                      />
                    </div>
                  )}

                  {activeTab === "manufacturer" && (
                    <div className="mt-4 space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p>
                        <strong className="text-black">Brand:</strong> {product.brand || "-"}
                      </p>
                      <p>
                        <strong className="text-black">Country:</strong>{" "}
                        {product.countryOfOrigin ||
                          product.returnPolicy?.countryOfOrigin ||
                          "India"}
                      </p>
                      <p>
                        <strong className="text-black">Manufacturer:</strong>{" "}
                        {product.returnPolicy?.importerNameAddress ||
                          product.brand ||
                          "Klassic"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>

            <Card>
              <SectionButton
  title="Ratings & Reviews"
  subtitle={`${approvedReviews.length} customer reviews`}
  section="reviews"
  openSection={openSection}
  toggleSection={toggleSection}
/>

              {openSection === "reviews" && (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="mt-1 text-sm font-medium text-gray-500">
                        Real customer feedback for this product
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black">
                        {avgRating ? avgRating.toFixed(1) : "0.0"}★
                      </p>
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        {approvedReviews.length} Reviews
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = approvedReviews.filter(
                        (r) => Number(r.rating) === star
                      ).length;

                      const percent =
                        approvedReviews.length > 0
                          ? (count / approvedReviews.length) * 100
                          : 0;

                      return (
                        <div key={star} className="rounded-2xl border p-3 flex flex-col items-center justify-center text-center">
                          <p className="font-black text-sm">{star} ★</p>

                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {count} reviews
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[40%_60%]">
                    <form onSubmit={submitReview} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <h3 className="mb-4 font-black">Write a Review</h3>

                      <input
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Your name"
                        className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />

                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                      >
                        <option value={5}>5 Star Rating</option>
                        <option value={4}>4 Star Rating</option>
                        <option value={3}>3 Star Rating</option>
                        <option value={2}>2 Star Rating</option>
                        <option value={1}>1 Star Rating</option>
                      </select>

                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write your experience..."
                        rows={4}
                        className="mb-4 w-full rounded-xl border p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />

                      <button
                        disabled={reviewLoading}
                        className="w-full rounded-full bg-black py-3 text-sm font-black text-white transition hover:bg-neutral-800 disabled:bg-gray-400"
                      >
                        {reviewLoading ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>

                    <div className="space-y-3">
                      {approvedReviews.length === 0 ? (
                        <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                          <span className="text-3xl mb-2">⭐</span>
                          No reviews yet. Be the first to review!
                        </div>
                      ) : (
                        approvedReviews.slice(0, 6).map((r, i) => (
                          <div key={r._id || i} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="font-black text-gray-900">{r.customer_name}</p>
                              <span className="rounded bg-green-600 px-2 py-1 text-[10px] font-black text-white">
                                {r.rating} ★
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-700">
                              {r.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-black">
      Questions & Answers
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Ask product-related questions before buying
    </p>
  </div>


</div>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    Ask product-related questions before buying
                  </p>
                </div>

                <div className="rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                  {questions.length} Q&A
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[40%_60%]">
                <form onSubmit={submitQuestion} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="mb-4 font-black">Ask a Question</h3>

                  <input
                    value={questionName}
                    onChange={(e) => setQuestionName(e.target.value)}
                    placeholder="Your name"
                    className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />

                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask about size, material, delivery, warranty..."
                    rows={4}
                    className="mb-4 w-full rounded-xl border p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />

                  <button
                    disabled={questionLoading}
                    className="w-full rounded-full bg-black py-3 text-sm font-black text-white transition hover:bg-neutral-800 disabled:bg-gray-400"
                  >
                    {questionLoading ? "Submitting..." : "Submit Question"}
                  </button>
                </form>

                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                      <span className="text-3xl mb-2">💬</span>
                      No questions yet. Ask the first question.
                    </div>
                  ) : (
                    questions.slice(0, 6).map((q, i) => (
                      <div key={q._id || i} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <p className="font-black text-sm">Q: {q.question}</p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Asked by {q.customer_name}
                        </p>

                        {q.answer ? (
                          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-800 border border-gray-200">
                            <b className="text-black">A:</b> {q.answer}
                          </div>
                        ) : (
                          <p className="mt-3 text-xs font-bold text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full">
                            ⏳ Awaiting seller answer
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </section>
        </div>

        <Carousel title="Frequently Bought Together" products={relatedProducts.slice(0, 3)} />
        <Carousel title="Similar Products" products={relatedProducts} />
        <Carousel title={`More From ${product.category}`} products={relatedProducts} />
      </section>

      {/* MOBILE FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] grid grid-cols-2 gap-2 border-t bg-white p-2 sm:hidden pb-safe">
        <button
          type="button"
          onClick={addToCart}
          disabled={stock <= 0}
          className={`rounded-full py-3.5 text-center text-sm font-black shadow-md ${
            stock > 0 ? "bg-black text-white" : "bg-gray-300 text-gray-500"
          }`}
        >
          Add to Cart
        </button>

        <button
          type="button"
          onClick={buyNow}
          disabled={stock <= 0}
          className={`rounded-full py-3.5 text-center text-sm font-black shadow-md ${
            stock > 0 ? "bg-yellow-400 text-black" : "bg-gray-300 text-gray-500"
          }`}
        >
          Buy ₹{totalPrice.toLocaleString('en-IN')}
        </button>
      </div>

      {showcaseOpen && (
        <div className="fixed inset-0 z-[9999] flex bg-black/70 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setShowcaseOpen(false)}
            className="hidden flex-1 md:block cursor-default"
          />

          <div className="h-full w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl md:ml-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-black px-6 py-5 text-white">
              <h2 className="text-lg font-black">Product Showcase</h2>
              <button
                type="button"
                onClick={() => setShowcaseOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xl font-bold hover:bg-white/30 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {images.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={product.name}
                  className="mb-4 w-full rounded-2xl object-contain border border-gray-100"
                />
              ))}

              <h3 className="mt-6 mb-2 text-lg font-black">Product Description</h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {product.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SectionButton({
  title,
  subtitle,
  section,
  openSection,
  toggleSection,
}: {
  title: string;
  subtitle?: string;
  section: string;
  openSection: string | null;
  toggleSection: (section: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between text-left py-2"
    >
      <div>
        <h3 className="text-2xl font-black text-gray-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
        <span
          className={`text-xl transition-transform ${
            openSection === section ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </div>
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-6 border border-gray-50">
      {children}
    </div>
  );
}

function Carousel({ title, products }: { title: string; products: any[] }) {
  if (!products?.length) return null;

  return (
    <section className="mt-6 rounded-3xl bg-white p-4 shadow-sm sm:p-6 border border-gray-50">
      <h2 className="mb-4 text-xl font-black sm:text-2xl text-gray-900">
        {title}
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
  {products.map((p: any) => (
    <Link
      key={p._id || p.id}
      href={`/product/${p._id || p.id}`}
      className="group flex h-[340px] min-w-[220px] max-w-[220px] flex-col rounded-2xl border border-gray-100 bg-white p-3 transition hover:border-black hover:shadow-lg"
    >
      <div className="flex h-[190px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#f8f9fa] p-2">
        <img
          src={p.image || "/placeholder.png"}
          alt={p.name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="line-clamp-2 min-h-[44px] text-sm font-bold leading-5 text-gray-800">
          {p.name}
        </p>

        <p className="mt-auto text-xl font-black text-green-700">
          ₹{Number(
            p.sale_price || p.salePrice || p.price || 0
          ).toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  ))}
</div>
    </section>
  );
}