"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  colors?: string;
  sizes?: string;
};

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

  const colorList = product.colors
    ? product.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const sizeList = product.sizes
    ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

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
      id: product.id,
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

  const buyNowLink = `/checkout?productId=${product.id}&color=${encodeURIComponent(
    selectedColor
  )}&size=${encodeURIComponent(selectedSize)}&price=${finalPrice}`;

  return (
    <div>
      <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-gray-500">Selected Price</p>
        <h2 className="text-3xl font-extrabold text-green-700">
          ₹{finalPrice.toFixed(2)}
        </h2>
        {selectedSize && (
          <p className="text-sm text-gray-600 mt-1">
            Size: <b>{selectedSize}</b>
          </p>
        )}
      </div>

      {colorList.length > 0 && (
        <div className="mt-5">
          <h3 className="font-bold mb-2">Select Color</h3>

          <div className="flex gap-3 flex-wrap">
            {colorList.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`border px-4 py-2 rounded-lg transition ${
                  selectedColor === color
                    ? "bg-blue-600 text-white border-blue-600"
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
          <h3 className="font-bold mb-2">Select Size</h3>

          <div className="flex gap-3 flex-wrap">
            {sizeList.map((size) => {
              const sizePrice = Number(product.price) * getSizeMultiplier(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded-lg transition ${
                    selectedSize === size
                      ? "bg-blue-600 text-white border-blue-600"
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

      <div className="grid grid-cols-2 gap-4 mt-5">
        <button
          type="button"
          onClick={addToCart}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white h-[64px] rounded-lg font-bold text-lg transition"
        >
          Add To Cart
        </button>

        <Link
          href={buyNowLink}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white h-[64px] rounded-lg font-bold text-lg transition"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}