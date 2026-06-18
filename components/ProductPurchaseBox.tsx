"use client";

import Link from "next/link";
import toast from "react-hot-toast";

type Variant = {
  color?: string;
  colorName?: string;
  colorCode?: string;
  image?: string;
  images?: string[];
  size?: string;
  stock?: string | number;
  price?: string | number;
  sale_price?: string | number;
  sku?: string;
};

type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  colors?: string | string[];
  sizes?: string | string[];
  variants?: Variant[];
};

export default function ProductPurchaseBox({ product }: { product: Product }) {
  const productId = product.id || product._id || "";

  const firstVariant =
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants[0]
      : undefined;

  const finalPrice = Number(
    firstVariant?.sale_price || firstVariant?.price || product.price || 0
  );

  const selectedImage =
    firstVariant?.images?.[0] || firstVariant?.image || product.image;

  const selectedColor =
    firstVariant?.colorName || firstVariant?.color || "";

  const selectedSize = firstVariant?.size || "";

  const selectedSku = firstVariant?.sku || "";

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: productId,
      name: product.name,
      price: finalPrice,
      basePrice: product.price,
      image: selectedImage,
      color: selectedColor,
      size: selectedSize,
      sku: selectedSku,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    toast.success(`${product.name} added to cart`);
  };

  const buyNowLink = `/checkout?productId=${productId}&color=${encodeURIComponent(
    selectedColor
  )}&size=${encodeURIComponent(selectedSize)}&price=${finalPrice}&sku=${encodeURIComponent(
    selectedSku
  )}`;

  return (
    <div className="pb-24 md:pb-0">
      <div className="mt-5 hidden grid-cols-2 gap-3 md:grid">
        <button
          type="button"
          onClick={addToCart}
          className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-[#2874f0] text-base font-black text-white shadow transition hover:bg-blue-700"
        >
          Add To Cart
        </button>

        <Link
          href={buyNowLink}
          className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-yellow-400 text-base font-black text-black shadow transition hover:bg-yellow-500"
        >
          Buy Now
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[999] border-t bg-white p-2 shadow-2xl md:hidden">
        <div className="grid grid-cols-[54px_1fr_1fr] gap-2">
          <button
            type="button"
            onClick={addToCart}
            className="flex h-[54px] items-center justify-center rounded-xl border bg-white text-2xl"
            aria-label="Add to cart"
          >
            🛒
          </button>

          <Link
            href={buyNowLink}
            className="flex h-[54px] items-center justify-center rounded-xl border bg-white text-center text-xs font-black text-slate-900"
          >
            Add Cart
          </Link>

          <Link
            href={buyNowLink}
            className="flex h-[54px] items-center justify-center rounded-xl bg-yellow-400 text-sm font-black text-black"
          >
            Buy ₹{finalPrice.toFixed(0)}
          </Link>
        </div>
      </div>
    </div>
  );
}