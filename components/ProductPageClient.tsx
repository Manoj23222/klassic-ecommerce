"use client";

import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
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
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedQuantity, setSelectedQuantity] = useState("");
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

  const defaultVariant =
    variants.find((v) => v.isDefault) || variants[0] || null;

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

  const price = Number(
    selectedVariant?.sale_price ||
      selectedVariant?.salePrice ||
      selectedVariant?.price ||
      product.sale_price ||
      product.salePrice ||
      product.price ||
      0
  );

  const mrp = Number(
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

const isGroceryProduct =
  String(product.category || "").toLowerCase().includes("grocery") ||
  String(product.category_path || "").toLowerCase().includes("grocery");

const showQuantitySelector = quantityOptions.length > 0;

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
          <section className="rounded-[2rem] bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-4 lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
              <div className="flex gap-2 overflow-x-auto sm:max-h-[430px] sm:flex-col">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 shrink-0 rounded-lg border bg-white p-1 sm:h-20 sm:w-20 ${
                      selectedImage === img
                        ? "border-black ring-1 ring-black ring-offset-2"
                        : "border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>

              <div className="flex min-h-[260px] items-center justify-center rounded-3xl bg-[#f8f9fa] p-4 sm:min-h-[520px]">
                <img
                  src={selectedImage || product.image || "/placeholder.png"}
                  alt={product.name}
                  className="max-h-[260px] w-full object-contain transition duration-500 hover:scale-105 sm:max-h-[500px]"
                />
              </div>
            </div>

            {hasRealColor && (
              
              <div className="mt-3 rounded-xl border bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold">
                    Select Color:{" "}
                    <span className="text-gray-700">{selectedColor}</span>
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    SKU: {selectedSku}
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {variants.map((v, i) => {
                    const active =
                      selectedVariant?.sku === v.sku || selectedVariant === v;

                    const img =
                      v.image ||
                      (Array.isArray(v.images) && v.images.length > 0
                        ? v.images[0]
                        : "") ||
                      product.image ||
                      "/placeholder.png";

                    return (
                      <button
                        key={v.sku || `${v.colorName}-${i}`}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedImage(img);
                        }}
                        className={`h-14 w-14 shrink-0 rounded-lg border-2 bg-white p-1 transition ${
                          active
                            ? "border-black ring-1 ring-black ring-offset-2"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={v.colorName || v.color || "Color"}
                          className="h-full w-full rounded-md object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-3 hidden grid-cols-2 gap-2 sm:grid">
              <AddToCartButton
                product={{
                  _id: productId,
                  name: product.name,
                  price,
                  image: selectedImage || product.image,
                  sku: selectedSku,
                  color: selectedColor,
                  stock,
                }}
              />

              <Link
                href={stock > 0 ? `/checkout?productId=${productId}` : "#"}
                className={`rounded-full py-3 text-center text-sm font-black ${
                  stock > 0
                    ? "border border-gray-300 bg-white text-black"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Buy Now
              </Link>
            </div>
          </section>

          <section className="max-h-none space-y-3 lg:max-h-[calc(135vh-180px)] lg:overflow-y-auto lg:pr-2">
            <Card>
              <p className="text-xs font-bold text-gray-500">
                {product.brand || product.category}
              </p>

              <h1 className="mt-1 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-green-600 px-2 py-1 text-[11px] font-black text-white">
                  {avgRating ? avgRating.toFixed(1) : "0.0"} ★
                </span>
                <span className="text-xs text-gray-500">
                  {approvedReviews.length > 0
                    ? `${approvedReviews.length} ratings`
                    : "No ratings yet"}
                </span>
              </div>

              

              <div className="mt-3 flex flex-wrap items-end gap-2">
                <p className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                  ₹{price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 line-through sm:text-lg">
                  ₹{finalMrp.toFixed(2)}
                </p>
                <p className="text-sm font-black text-green-600">
                  {discount}% off
                </p>
              </div>
{showQuantitySelector && (
  <div className="mt-4">
    <p className="mb-2 text-sm font-bold">
      Selected Quantity:
      <span className="ml-2 text-gray-700">{selectedQuantity}</span>
    </p>

    <div className="flex gap-2 overflow-x-auto">
      {quantityOptions.map((qty: string) => (
        <button
          key={qty}
          type="button"
          onClick={() => setSelectedQuantity(qty)}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-bold ${
            selectedQuantity === qty
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-black"
          }`}
        >
          {qty}
        </button>
      ))}
    </div>
  </div>
)}
              <div className="mt-2 text-xs text-gray-600 sm:text-sm">
                <p>
                  SKU: <b>{selectedSku}</b>
                </p>
                {hasRealColor && (
                  
  <p>
    Color: <b>{selectedColor}</b>
  </p>
)}
              </div>

              <p
                className={
                  stock > 0
                    ? "mt-2 text-sm font-black text-green-600"
                    : "mt-2 text-sm font-black text-red-600"
                }
              >
                {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
              </p>
            </Card>

            <Card>
              <SectionButton
                title="Delivery Information"
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
                  <div className="mt-3 space-y-1 text-sm">
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
                section="trust"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "trust" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-green-50 p-4">
                    <p className="text-2xl">✔</p>
                    <p className="mt-2 font-black">Genuine Product</p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-2xl">🚚</p>
                    <p className="mt-2 font-black">Fast Delivery</p>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-4">
                    <p className="text-2xl">↩</p>
                    <p className="mt-2 font-black">Easy Returns</p>
                  </div>

                  <div className="rounded-2xl bg-purple-50 p-4">
                    <p className="text-2xl">🔒</p>
                    <p className="mt-2 font-black">Secure Payment</p>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <SectionButton
                title="Highlights"
                section="highlights"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "highlights" && (
                <>
                  {Array.isArray(product.features) &&
                  product.features.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {product.features.map((f: string, i: number) => (
                        <li key={i}>✓ {f}</li>
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
                title="Secure Shopping"
                section="secure"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "secure" && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>🔒 Secure Payments</div>
                  <div>↩ Easy Returns</div>
                  <div>🚚 Fast Delivery</div>
                  <div>✔ Genuine Product</div>
                </div>
              )}
            </Card>

            <Card>
              <SectionButton
                title="All Details"
                section="details"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "details" && (
                <>
                  <div className="overflow-x-auto border-b border-gray-300">
                    <div className="flex min-w-max gap-8 text-sm font-semibold tracking-tight">
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
                              : "text-gray-500"
                          }`}
                        >
                          {tab === "manufacturer"
                            ? "Manufacturer Info"
                            : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "description" && (
                    <div className="mt-3 text-sm leading-7">
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
                    <div className="mt-3 space-y-3 text-sm">
                      <p>
                        <strong>Brand:</strong> {product.brand || "-"}
                      </p>
                      <p>
                        <strong>Country:</strong>{" "}
                        {product.countryOfOrigin ||
                          product.returnPolicy?.countryOfOrigin ||
                          "India"}
                      </p>
                      <p>
                        <strong>Manufacturer:</strong>{" "}
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
                section="reviews"
                openSection={openSection}
                toggleSection={toggleSection}
              />

              {openSection === "reviews" && (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mt-1 text-sm text-gray-500">
                        Real customer feedback for this product
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black">
                        {avgRating ? avgRating.toFixed(1) : "0.0"}★
                      </p>
                      <p className="text-xs text-gray-500">
                        {approvedReviews.length} Reviews
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = approvedReviews.filter(
                        (r) => Number(r.rating) === star
                      ).length;

                      const percent =
                        approvedReviews.length > 0
                          ? (count / approvedReviews.length) * 100
                          : 0;

                      return (
                        <div key={star} className="rounded-2xl border p-3">
                          <p className="font-black">{star} ★</p>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-green-600"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-gray-500">
                            {count} reviews
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[40%_60%]">
                    <form
                      onSubmit={submitReview}
                      className="rounded-2xl border p-4"
                    >
                      <h3 className="mb-3 font-black">Write a Review</h3>

                      <input
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Your name"
                        className="mb-2 w-full rounded-xl border p-3 text-sm"
                      />

                      <select
                        value={reviewRating}
                        onChange={(e) =>
                          setReviewRating(Number(e.target.value))
                        }
                        className="mb-2 w-full rounded-xl border p-3 text-sm"
                      >
                        <option value={5}>5 Star</option>
                        <option value={4}>4 Star</option>
                        <option value={3}>3 Star</option>
                        <option value={2}>2 Star</option>
                        <option value={1}>1 Star</option>
                      </select>

                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write your review"
                        rows={4}
                        className="mb-3 w-full rounded-xl border p-3 text-sm"
                      />

                      <button
                        disabled={reviewLoading}
                        className="w-full rounded-full bg-black py-3 text-sm font-black text-white disabled:bg-gray-400"
                      >
                        {reviewLoading ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>

                    <div className="space-y-3">
                      {approvedReviews.length === 0 ? (
                        <div className="rounded-2xl border p-5 text-sm text-gray-500">
                          No reviews yet. Be the first to review this product.
                        </div>
                      ) : (
                        approvedReviews.slice(0, 6).map((r, i) => (
                          <div
                            key={r._id || i}
                            className="rounded-2xl border p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-black">{r.customer_name}</p>
                              <span className="rounded bg-green-600 px-2 py-1 text-xs font-black text-white">
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">Questions & Answers</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Ask product-related questions before buying
                  </p>
                </div>

                <div className="rounded-full bg-black px-4 py-2 text-xs font-black text-white">
                  {questions.length} Q&A
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[40%_60%]">
                <form
                  onSubmit={submitQuestion}
                  className="rounded-2xl border p-4"
                >
                  <h3 className="mb-3 font-black">Ask a Question</h3>

                  <input
                    value={questionName}
                    onChange={(e) => setQuestionName(e.target.value)}
                    placeholder="Your name"
                    className="mb-2 w-full rounded-xl border p-3 text-sm"
                  />

                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask about size, material, delivery, warranty..."
                    rows={4}
                    className="mb-3 w-full rounded-xl border p-3 text-sm"
                  />

                  <button
                    disabled={questionLoading}
                    className="w-full rounded-full bg-black py-3 text-sm font-black text-white disabled:bg-gray-400"
                  >
                    {questionLoading ? "Submitting..." : "Submit Question"}
                  </button>
                </form>

                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <div className="rounded-2xl border p-5 text-sm text-gray-500">
                      No questions yet. Ask the first question.
                    </div>
                  ) : (
                    questions.slice(0, 6).map((q, i) => (
                      <div key={q._id || i} className="rounded-2xl border p-4">
                        <p className="font-black">Q: {q.question}</p>

                        <p className="mt-1 text-xs text-gray-500">
                          Asked by {q.customer_name}
                        </p>

                        {q.answer ? (
                          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
                            <b>A:</b> {q.answer}
                          </div>
                        ) : (
                          <p className="mt-3 text-xs font-bold text-orange-600">
                            Awaiting seller answer
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

        <Carousel
          title="Frequently Bought Together"
          products={relatedProducts.slice(0, 3)}
        />

        <Carousel title="Similar Products" products={relatedProducts} />

        <Carousel
          title={`More From ${product.category}`}
          products={relatedProducts}
        />
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-[999] grid grid-cols-2 gap-2 border-t bg-white p-2 sm:hidden">
        <AddToCartButton
          product={{
            _id: productId,
            name: product.name,
            price,
            image: selectedImage || product.image,
            sku: selectedSku,
            color: selectedColor,
            stock,
          }}
        />

        <Link
          href={stock > 0 ? `/checkout?productId=${productId}` : "#"}
          className={`rounded-full py-3 text-center text-sm font-black ${
            stock > 0 ? "bg-yellow-400 text-black" : "bg-gray-300 text-gray-500"
          }`}
        >
          Buy ₹{price.toFixed(0)}
        </Link>
      </div>

      {showcaseOpen && (
        <div className="fixed inset-0 z-[9999] flex bg-black/60">
          <button
            type="button"
            onClick={() => setShowcaseOpen(false)}
            className="hidden flex-1 md:block"
          />

          <div className="h-full w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl md:ml-auto">
            <div className="sticky top-0 z-10 flex items-center gap-4 bg-blue-600 px-4 py-4 text-white">
              <button
                type="button"
                onClick={() => setShowcaseOpen(false)}
                className="text-3xl font-black leading-none"
              >
                ×
              </button>

              <h2 className="text-lg font-black">Product Details</h2>
            </div>

            <div className="p-4">
              <p className="mb-3 text-sm font-bold">Description</p>

              {images.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={product.name}
                  className="mb-4 w-full rounded-xl object-contain"
                />
              ))}

              <p className="text-sm leading-7 text-gray-700">
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
  section,
  openSection,
  toggleSection,
}: {
  title: string;
  section: string;
  openSection: string | null;
  toggleSection: (section: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between text-left text-lg font-black"
    >
      <span>{title}</span>
      <span className="text-xl">{openSection === section ? "⌃" : "⌄"}</span>
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-5">
      {children}
    </div>
  );
}

function Carousel({ title, products }: { title: string; products: any[] }) {
  if (!products?.length) return null;

  return (
    <section className="mt-5 rounded-xl bg-white p-3 shadow-sm sm:p-5">
      <h2 className="mb-3 text-lg font-black sm:text-2xl">{title}</h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((p: any) => (
          <Link
            key={p._id}
            href={`/product/${p._id}`}
            className="min-w-[130px] max-w-[150px] rounded-xl border p-2 sm:min-w-[190px]"
          >
            <img
              src={p.image || "/placeholder.png"}
              alt={p.name}
              className="h-28 w-full object-contain sm:h-36"
            />
            <p className="mt-2 line-clamp-2 text-xs font-bold">{p.name}</p>
            <p className="text-sm font-black text-green-700">
              ₹{Number(p.sale_price || p.salePrice || p.price || 0).toFixed(0)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}