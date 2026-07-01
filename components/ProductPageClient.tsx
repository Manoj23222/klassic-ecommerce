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
        if (item?.label) acc[String(item.label).trim()] = Number(item.price || 0);
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

  const showQuantitySelector = false;

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

  const isTextVariant =
    product.variationTheme === "Size" || product.variationTheme === "Weight";

  const cartItem = {
    _id: productId,
    id: productId,
    name: product.name,
    price,
    unitPrice: price,
    selectedPrice: price,
    buyQty: 1,
    quantity: 1,
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
      const oldQty = Number(
        newCart[existingIndex].buyQty || newCart[existingIndex].quantity || 1
      );
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
          `/checkout?buyNow=1&productId=${productId}&color=${
            selectedColor || ""
          }&quantity=${selectedQuantity || ""}&price=${price}&qty=1`
        )}`
      );
      return;
    }

    router.push(
      `/checkout?buyNow=1&productId=${productId}&color=${encodeURIComponent(
        selectedColor || ""
      )}&quantity=${encodeURIComponent(selectedQuantity || "")}&price=${price}&qty=1`
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
    <main className="min-h-screen bg-[#f1f3f6] pb-20 text-[#111]">
      <Header />

      <section className="mx-auto max-w-7xl px-2 py-2 sm:px-4">
        <div className="mb-2 text-[10px] font-bold text-blue-600 sm:text-xs">
          Home / {product.category} / {product.name}
        </div>

        <div className="grid gap-3 lg:grid-cols-[52%_48%]">
          <section className="rounded-[1.4rem] bg-white p-2 shadow-sm sm:p-3 lg:sticky lg:top-20 lg:self-start">
            <div className="grid gap-3 sm:grid-cols-[74px_1fr]">
              <div className="flex gap-2 overflow-x-auto sm:max-h-[380px] sm:flex-col">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 sm:h-16 sm:w-16 ${
                      selectedImage === img
                        ? "border-black ring-1 ring-black ring-offset-1"
                        : "border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full rounded-md object-contain"
                    />
                  </button>
                ))}
              </div>

              <div className="flex min-h-[245px] items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#f4f1ec] p-3 sm:min-h-[465px]">
                <img
                  src={selectedImage || product.image || "/placeholder.png"}
                  alt={product.name}
                  className="max-h-[240px] w-full object-contain transition duration-500 hover:scale-105 sm:max-h-[450px]"
                />
              </div>
            </div>

            <div className="mt-3 hidden grid-cols-2 gap-2 sm:grid">
              <button
                type="button"
                onClick={addToCart}
                disabled={stock <= 0}
                className={`rounded-full py-2.5 text-center text-xs font-black ${
                  stock > 0
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                Add To Cart
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={stock <= 0}
                className={`rounded-full py-2.5 text-center text-xs font-black ${
                  stock > 0
                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                Buy Now
              </button>
            </div>
          </section>

          <section className="max-h-none space-y-2 lg:max-h-[calc(100vh-90px)] lg:overflow-y-auto lg:pr-1">
            <Card>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {product.brand || product.category || "Klassic"}
              </p>

              <h1 className="mt-1 text-base font-black leading-tight tracking-tight text-gray-900 sm:text-xl">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-green-600 px-2 py-0.5 text-[10px] font-black text-white">
                  {avgRating ? avgRating.toFixed(1) : "0.0"} ★
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {approvedReviews.length > 0
                    ? `${approvedReviews.length} Ratings`
                    : "No ratings yet"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-end gap-2 border-b border-gray-100 pb-3">
                <p className="text-2xl font-black tracking-tight text-black sm:text-3xl">
                  ₹{price.toFixed(2)}
                </p>
                <p className="mb-1 text-xs font-semibold text-gray-400 line-through sm:text-sm">
                  ₹{finalMrp.toFixed(2)}
                </p>
                <p className="mb-1 text-xs font-black text-green-600">
                  {discount}% off
                </p>
              </div>

              {hasRealColor && (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-bold text-gray-700">
                    Select {product.variationTheme || "Color"}:
                    <span className="ml-2 text-black">{selectedColor}</span>
                  </p>

                  <div className="flex flex-wrap gap-2 pb-1">
                    {variants.map((v, i) => {
                      const active =
                        selectedVariant?.sku === v.sku || selectedVariant === v;
                      const isOutOfStock = Number(v.stock) <= 0;

                      const img =
                        v.image ||
                        (Array.isArray(v.images) && v.images.length > 0
                          ? v.images[0]
                          : "") ||
                        product.image ||
                        "/placeholder.png";

                      if (isTextVariant) {
                        return (
                          <button
                            key={v.sku || `${v.size}-${i}`}
                            disabled={isOutOfStock}
                            onClick={() => {
                              setSelectedVariant(v);
                              setSelectedImage(img);
                            }}
                            className={`relative rounded-lg px-3 py-2 text-xs font-black transition ${
                              active
                                ? "border border-black bg-black text-white"
                                : "border border-gray-300 bg-white text-gray-700"
                            } ${
                              isOutOfStock
                                ? "cursor-not-allowed bg-gray-50 opacity-50"
                                : ""
                            }`}
                          >
                            {v.size || v.colorName}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={v.sku || `${v.colorName}-${i}`}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedVariant(v);
                            setSelectedImage(img);
                          }}
                          className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition ${
                            active
                              ? "border-black ring-1 ring-black"
                              : "border-gray-200 hover:border-gray-400"
                          } ${
                            isOutOfStock
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <img
                            src={img}
                            alt={v.colorName || "Color"}
                            className="h-full w-full rounded-md object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-600 sm:text-xs">
                <div>
                  <p>
                    SKU: <b className="text-gray-900">{selectedSku}</b>
                  </p>
                  <p
                    className={
                      stock > 0
                        ? "mt-1 font-black text-green-600"
                        : "mt-1 font-black text-red-600"
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
                      className="flex-1 rounded-xl border p-2.5 text-xs font-bold outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={checkPincode}
                      className="rounded-xl bg-black px-4 text-xs font-black text-white"
                    >
                      Check
                    </button>
                  </div>

                  {pincodeMessage && (
                    <p
                      className={`mt-2 text-xs font-bold ${
                        pincodeMessage.includes("✅")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {pincodeMessage}
                    </p>
                  )}

                  <div className="mt-2 space-y-1 text-xs font-medium text-gray-700">
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
                <div className="grid grid-cols-2 gap-2">
                  <MiniTrust icon="✔" text="Genuine Product" />
                  <MiniTrust icon="🚚" text="Fast Delivery" />
                  <MiniTrust icon="↩" text="Easy Returns" />
                  <MiniTrust icon="🔒" text="Secure Payment" />
                </div>
              )}
            </Card>

            <Card>
              <SectionButton
                title="Product Highlights"
                subtitle="Key features and specifications"
                section="highlights"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "highlights" && (
                <>
                  {Array.isArray(product.features) &&
                  product.features.length > 0 ? (
                    <ul className="space-y-1 text-xs font-medium text-gray-700">
                      {product.features.map((f: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold text-green-600">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">
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
                  <div className="overflow-x-auto border-b border-gray-200">
                    <div className="flex min-w-max gap-5 text-xs font-black">
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
                          className={`pb-2 capitalize transition ${
                            activeTab === tab
                              ? "border-b-2 border-black text-black"
                              : "text-gray-500 hover:text-black"
                          }`}
                        >
                          {tab === "manufacturer" ? "Manufacturer" : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "description" && (
                    <div className="mt-3 text-xs leading-6 text-gray-800">
                      {product.description || "No description available"}
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div className="mt-3 text-xs">
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
                    <div className="mt-3 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                      <p>
                        <strong className="text-black">Brand:</strong>{" "}
                        {product.brand || "-"}
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
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <p className="text-xs font-medium text-gray-500">
                      Real customer feedback for this product
                    </p>

                    <div className="text-right">
                      <p className="text-2xl font-black">
                        {avgRating ? avgRating.toFixed(1) : "0.0"}★
                      </p>
                      <p className="text-[10px] font-bold text-gray-500">
                        {approvedReviews.length} Reviews
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = approvedReviews.filter(
                        (r) => Number(r.rating) === star
                      ).length;

                      const percent =
                        approvedReviews.length > 0
                          ? (count / approvedReviews.length) * 100
                          : 0;

                      return (
                        <div
                          key={star}
                          className="flex flex-col items-center justify-center rounded-xl border p-2 text-center"
                        >
                          <p className="text-xs font-black">{star} ★</p>
                          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                            {count}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-[40%_60%]">
                    <form
                      onSubmit={submitReview}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >
                      <h3 className="mb-3 text-sm font-black">Write a Review</h3>

                      <input
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Your name"
                        className="mb-2 w-full rounded-xl border p-2 text-xs outline-none focus:border-black"
                      />

                      <select
                        value={reviewRating}
                        onChange={(e) =>
                          setReviewRating(Number(e.target.value))
                        }
                        className="mb-2 w-full rounded-xl border p-2 text-xs outline-none focus:border-black"
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
                        rows={3}
                        className="mb-3 w-full rounded-xl border p-2 text-xs outline-none focus:border-black"
                      />

                      <button
                        disabled={reviewLoading}
                        className="w-full rounded-full bg-black py-2.5 text-xs font-black text-white disabled:bg-gray-400"
                      >
                        {reviewLoading ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>

                    <div className="space-y-2">
                      {approvedReviews.length === 0 ? (
                        <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
                          <span className="mb-1 text-2xl">⭐</span>
                          No reviews yet.
                        </div>
                      ) : (
                        approvedReviews.slice(0, 6).map((r, i) => (
                          <div
                            key={r._id || i}
                            className="rounded-xl border border-gray-100 p-3 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black text-gray-900">
                                {r.customer_name}
                              </p>
                              <span className="rounded bg-green-600 px-2 py-0.5 text-[9px] font-black text-white">
                                {r.rating} ★
                              </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-700">
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
              <SectionButton
                title="Questions & Answers"
                subtitle="Ask product-related questions before buying"
                section="qa"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "qa" && (
                <div className="mt-3 grid gap-3 lg:grid-cols-[40%_60%]">
                  <form
                    onSubmit={submitQuestion}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <h3 className="mb-3 text-sm font-black">Ask a Question</h3>

                    <input
                      value={questionName}
                      onChange={(e) => setQuestionName(e.target.value)}
                      placeholder="Your name"
                      className="mb-2 w-full rounded-xl border p-2 text-xs outline-none focus:border-black"
                    />

                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Ask about size, material, delivery..."
                      rows={3}
                      className="mb-3 w-full rounded-xl border p-2 text-xs outline-none focus:border-black"
                    />

                    <button
                      disabled={questionLoading}
                      className="w-full rounded-full bg-black py-2.5 text-xs font-black text-white disabled:bg-gray-400"
                    >
                      {questionLoading ? "Submitting..." : "Submit Question"}
                    </button>
                  </form>

                  <div className="space-y-2">
                    {questions.length === 0 ? (
                      <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
                        <span className="mb-1 text-2xl">💬</span>
                        No questions yet.
                      </div>
                    ) : (
                      questions.slice(0, 6).map((q, i) => (
                        <div
                          key={q._id || i}
                          className="rounded-xl border border-gray-100 p-3 shadow-sm"
                        >
                          <p className="text-xs font-black">Q: {q.question}</p>

                          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            Asked by {q.customer_name}
                          </p>

                          {q.answer ? (
                            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs text-gray-800">
                              <b className="text-black">A:</b> {q.answer}
                            </div>
                          ) : (
                            <p className="mt-2 w-fit rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-600">
                              Awaiting seller answer
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

        <Carousel
          title="Frequently Bought Together"
          products={relatedProducts.slice(0, 3)}
        />
        <Carousel title="Similar Products" products={relatedProducts} />
        <Carousel title={`More From ${product.category}`} products={relatedProducts} />
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-[999] grid grid-cols-2 gap-2 border-t bg-white p-2 pb-safe sm:hidden">
        <button
          type="button"
          onClick={addToCart}
          disabled={stock <= 0}
          className={`rounded-full py-3 text-center text-xs font-black shadow-md ${
            stock > 0 ? "bg-black text-white" : "bg-gray-300 text-gray-500"
          }`}
        >
          Add to Cart
        </button>

        <button
          type="button"
          onClick={buyNow}
          disabled={stock <= 0}
          className={`rounded-full py-3 text-center text-xs font-black shadow-md ${
            stock > 0 ? "bg-yellow-400 text-black" : "bg-gray-300 text-gray-500"
          }`}
        >
          Buy ₹{price.toLocaleString("en-IN")}
        </button>
      </div>

      {showcaseOpen && (
        <div className="fixed inset-0 z-[9999] flex bg-black/70 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setShowcaseOpen(false)}
            className="hidden flex-1 cursor-default md:block"
          />

          <div className="h-full w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl md:ml-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-black px-5 py-4 text-white">
              <h2 className="text-base font-black">Product Showcase</h2>
              <button
                type="button"
                onClick={() => setShowcaseOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              {images.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={product.name}
                  className="mb-3 w-full rounded-2xl border border-gray-100 object-contain"
                />
              ))}

              <h3 className="mb-2 mt-5 text-base font-black">
                Product Description
              </h3>
              <p className="text-xs leading-6 text-gray-700">
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
      className="flex w-full items-center justify-between py-1.5 text-left"
    >
      <div>
        <h3 className="text-sm font-black text-gray-900 sm:text-base">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100">
        <span
          className={`text-base transition-transform ${
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
    <div className="rounded-[1.1rem] border border-black/5 bg-white p-3 shadow-sm sm:p-4">
      {children}
    </div>
  );
}

function MiniTrust({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-[#f7f5f1] p-3">
      <p className="text-lg">{icon}</p>
      <p className="mt-1 text-xs font-black text-gray-900">{text}</p>
    </div>
  );
}

function Carousel({ title, products }: { title: string; products: any[] }) {
  if (!products?.length) return null;

  return (
    <section className="mt-4 rounded-[1.4rem] bg-white p-3 shadow-sm sm:p-4">
      <h2 className="mb-3 text-base font-black text-gray-900 sm:text-xl">
        {title}
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p: any) => {
          const id = p._id || p.id;
          const itemPrice = Number(p.sale_price || p.salePrice || p.price || 0);
          const mrp =
            Number(p.regularPrice || p.price || 0) > itemPrice
              ? Number(p.regularPrice || p.price || 0)
              : Math.round(itemPrice * 1.18);

          return (
            <Link
              key={id}
              href={`/product/${id}`}
              className="group flex min-h-[230px] min-w-[190px] flex-col rounded-[1.1rem] bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-h-[270px] sm:min-w-0"
            >
              <div className="flex h-[105px] items-center justify-center overflow-hidden rounded-xl bg-[#f4f1ec] p-2 sm:h-[160px]">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name || "Product"}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              <p className="mt-2 text-[8px] font-black uppercase tracking-widest text-gray-400 sm:text-[10px]">
                {p.brand || p.category || "Klassic"}
              </p>

              <h3 className="mt-1 line-clamp-2 min-h-[30px] text-[10px] font-black leading-4 text-gray-900 sm:text-sm">
                {p.name}
              </h3>

              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <p className="text-xs font-black sm:text-base">
                  ₹{itemPrice.toLocaleString("en-IN")}
                </p>

                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-black sm:text-[10px] ${
                    Number(p.stock || 0) > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {Number(p.stock || 0) > 0 ? "In Stock" : "Out"}
                </span>
              </div>

              {mrp > itemPrice && (
                <p className="mt-0.5 text-[9px] text-gray-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}