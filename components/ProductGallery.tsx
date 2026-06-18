"use client";

import { useEffect, useMemo, useState } from "react";

type Variant = {
  _id?: string;
  color?: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  sku?: string;
  price?: number | string;
  sale_price?: number | string;
  stock?: number | string;
  images?: string[];
};

export default function ProductGallery({
  mainImage,
  galleryImages,
  variants = [],
}: {
  mainImage: string;
  galleryImages: string[];
  variants?: Variant[];
}) {
  const validVariants = variants.filter((v) => v?.color || v?.colorName);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    validVariants[0] || null
  );

  const images = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }

    return [
      mainImage,
      ...(galleryImages || []).filter((img) => img && img !== mainImage),
    ].filter(Boolean);
  }, [selectedVariant, mainImage, galleryImages]);

  const [selectedImage, setSelectedImage] = useState(images[0] || mainImage);

  useEffect(() => {
    setSelectedImage(images[0] || mainImage);
  }, [images, mainImage]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex md:flex-col gap-3 overflow-auto md:max-h-[520px] pb-2">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              onClick={() => setSelectedImage(img)}
              className={`shrink-0 border-2 rounded-xl overflow-hidden bg-white ${
                selectedImage === img ? "border-blue-600" : "border-gray-200"
              }`}
            >
              <img src={img} alt="" className="w-20 h-20 object-contain" />
            </button>
          ))}
        </div>

        <div className="flex-1 border rounded-2xl bg-white p-6 flex items-center justify-center">
          <img
            src={selectedImage || "/placeholder.png"}
            alt="Product"
            className="max-h-[500px] w-full object-contain"
          />
        </div>
      </div>

      {validVariants.length > 0 && (
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">Select Color</h3>
              <p className="text-xs text-gray-500">
                Selected SKU:{" "}
                <b>{selectedVariant?.sku || "No SKU"}</b>
              </p>
            </div>

            <div className="text-right text-sm">
              <p className="font-black text-green-700">
                ₹
                {Number(
                  selectedVariant?.sale_price ||
                    selectedVariant?.price ||
                    0
                ).toFixed(2)}
              </p>
              <p
                className={
                  Number(selectedVariant?.stock || 0) > 0
                    ? "text-xs font-bold text-green-600"
                    : "text-xs font-bold text-red-600"
                }
              >
                {Number(selectedVariant?.stock || 0) > 0
                  ? `Stock: ${selectedVariant?.stock}`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {validVariants.map((v, index) => {
              const active = selectedVariant?.sku === v.sku;
              const label = v.colorName || v.color || `Color ${index + 1}`;
              const preview = v.images?.[0];

              return (
                <button
                  key={v.sku || index}
                  onClick={() => setSelectedVariant(v)}
                  className={`min-w-[130px] rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-7 w-7 rounded-full border"
                      style={{ backgroundColor: v.colorCode || "#e5e7eb" }}
                    />

                    <span className="line-clamp-1 text-sm font-black">
                      {label}
                    </span>
                  </div>

                  {preview && (
                    <img
                      src={preview}
                      alt={label}
                      className="mt-3 h-20 w-full rounded-xl object-contain bg-gray-50"
                    />
                  )}

                  <p className="mt-2 text-xs text-gray-500">
                    SKU: {v.sku || "-"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}