"use client";

import { useState } from "react";

export default function ProductVariantSelector({
  colors,
  sizes,
}: {
  colors?: string;
  sizes?: string;
}) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div>
      {colors && (
        <div className="mt-5">
          <h3 className="font-bold mb-2">Select Color</h3>

          <div className="flex gap-3 flex-wrap">
            {colors.split(",").map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color.trim())}
                className={`border px-4 py-2 rounded-lg ${
                  selectedColor === color.trim()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:border-blue-600"
                }`}
              >
                {color.trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes && (
        <div className="mt-5">
          <h3 className="font-bold mb-2">Select Size</h3>

          <div className="flex gap-3 flex-wrap">
            {sizes.split(",").map((size: string) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size.trim())}
                className={`border px-4 py-2 rounded-lg ${
                  selectedSize === size.trim()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:border-blue-600"
                }`}
              >
                {size.trim()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}