"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  colors?: string | string[];
  sizes?: string | string[];
};

function toList(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function getSizeMultiplier(size: string) {
  const clean = size.toLowerCase().replace(/\s/g, "");

  if (clean === "500g") return 0.5;
  if (clean === "1kg") return 1;
  if (clean === "5kg") return 5;
  if (clean === "10kg") return 10;

  return 1;
}

export default function ProductPurchaseBox({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const productId = product.id || product._id || "";

  const colorList = toList(product.colors);
  const sizeList = toList(product.sizes);

  const finalPrice = useMemo(() => {
    if (!selectedSize) return Number(product.price);
    return Number(product.price) * getSizeMultiplier(selectedSize);
  }, [product.price, selectedSize]);

  const addToCart = () => {
    if (colorList.length > 0 && !selectedColor) {
      toast.error("Please select color");
      return;
    }

    if (sizeList.length > 0 && !selectedSize) {
      toast.error("Please select size");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: productId,
      name: product.name,
      price: finalPrice,
      basePrice: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    toast.success(`${product.name} added to cart`);
  };

  const buyNowLink = `/checkout?productId=${productId}&color=${encodeURIComponent(
    selectedColor
  )}&size=${encodeURIComponent(selectedSize)}&price=${finalPrice}`;

  return (
    <div>
      <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-gray-500">Selected Price</p>
        <h2 className="text-3xl font-extrabold text-green-700">
          ₹{finalPrice.toFixed(2)}
        </h2>

        {selectedSize && (
          <p className="mt-1 text-sm text-gray-600">
            Size: <b>{selectedSize}</b>
          </p>
        )}
      </div>

      {colorList.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 font-bold">Select Color</h3>

          <div className="flex flex-wrap gap-3">
            {colorList.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-lg border px-4 py-2 transition ${
                  selectedColor === color
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "bg-white hover:border-blue-600"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizeList.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 font-bold">Select Size</h3>

          <div className="flex flex-wrap gap-3">
            {sizeList.map((size) => {
              const sizePrice = Number(product.price) * getSizeMultiplier(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-4 py-2 transition ${
                    selectedSize === size
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "bg-white hover:border-blue-600"
                  }`}
                >
                  <div className="font-bold">{size}</div>
                  <div className="text-xs">₹{sizePrice.toFixed(2)}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={addToCart}
          className="flex h-[64px] w-full items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white transition hover:bg-blue-700"
        >
          Add To Cart
        </button>

        <Link
          href={buyNowLink}
          className="flex h-[64px] w-full items-center justify-center rounded-lg bg-green-600 text-lg font-bold text-white transition hover:bg-green-700"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}