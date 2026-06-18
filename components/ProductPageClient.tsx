"use client";

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

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20">
      <Header />

      <section className="mx-auto max-w-[1450px] px-2 py-3 sm:px-4">
        <div className="mb-2 text-[11px] font-bold text-blue-600 sm:text-sm">
          Home / {product.category} / {product.name}
        </div>

        <div className="grid gap-5 lg:grid-cols-[48%_52%]">
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

            {variants.length > 0 && (
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

          <section className="max-h-none space-y-3 lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto lg:pr-2">
            <Card>
              <p className="text-xs font-bold text-gray-500">
                {product.brand || product.category}
              </p>

              <h1 className="mt-1 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-green-600 px-2 py-1 text-[11px] font-black text-white">
                  4.3 ★
                </span>
                <span className="text-xs text-gray-500">
                  Very Good | 1,000+ ratings
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

              <div className="mt-2 text-xs text-gray-600 sm:text-sm">
                <p>
                  SKU: <b>{selectedSku}</b>
                </p>
                <p>
                  Color: <b>{selectedColor}</b>
                </p>
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
              <h2 className="mb-3 text-xl font-black">All Details</h2>

              <div className="overflow-x-auto border-b border-gray-300">
                <div className="flex min-w-max gap-8 text-sm font-semibold tracking-tight">
                  {[
                    "specifications",
                    "warranty",
                    "description",
                    "manufacturer",
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm capitalize transition ${
                        activeTab === tab
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {tab === "manufacturer" ? "Manufacturer Info" : tab}
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
                    }}
                  />
                </div>
              )}

              {activeTab === "warranty" && (
                <div className="mt-3 space-y-3 text-sm">
                  <p>
                    <strong>Warranty:</strong>{" "}
                    {product.returnPolicy?.warranty || "1 Year Warranty"}
                  </p>
                  <p>
                    <strong>Return:</strong>{" "}
                    {product.returnPolicy?.returnDays || 7} Days
                  </p>
                  <p>
                    <strong>Cash On Delivery:</strong> Available
                  </p>
                  <p>
                    <strong>Replacement:</strong> Available
                  </p>
                </div>
              )}

              {activeTab === "manufacturer" && (
                <div className="mt-3 space-y-3 text-sm">
                  <p>
                    <strong>Brand:</strong> {product.brand || "-"}
                  </p>
                  <p>
                    <strong>Seller:</strong> {product.seller_store_name || "-"}
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
    </main>
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