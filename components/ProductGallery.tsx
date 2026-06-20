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

  const [selectedImage, setSelectedImage] = useState(
    images[0] || mainImage || "/placeholder.png"
  );

  useEffect(() => {
    setSelectedImage(images[0] || mainImage || "/placeholder.png");
  }, [images, mainImage]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white p-2 shadow-sm">
        <div className="flex flex-col-reverse gap-2 md:flex-row">
          <div className="flex gap-2 overflow-x-auto pb-1 md:max-h-[480px] md:w-[70px] md:flex-col md:overflow-y-auto md:overflow-x-hidden">
            {images.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-white p-1 transition md:h-16 md:w-16 ${
                  selectedImage === img
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-gray-200"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="flex min-h-[260px] flex-1 items-center justify-center rounded-2xl bg-[#f7f8fb] p-3 md:min-h-[500px] md:p-6">
            <img
              src={selectedImage || "/placeholder.png"}
              alt="Product"
              className="max-h-[260px] w-full object-contain transition duration-300 md:max-h-[500px]"
            />
          </div>
        </div>
      </div>

      {validVariants.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black md:text-lg">Select Color</h3>
              <p className="text-[10px] font-bold text-gray-500 md:text-xs">
                SKU: {selectedVariant?.sku || "No SKU"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-green-700 md:text-base">
                ₹
                {Number(
                  selectedVariant?.sale_price || selectedVariant?.price || 0
                ).toFixed(0)}
              </p>
              <p
                className={
                  Number(selectedVariant?.stock || 0) > 0
                    ? "text-[10px] font-bold text-green-600"
                    : "text-[10px] font-bold text-red-600"
                }
              >
                {Number(selectedVariant?.stock || 0) > 0
                  ? `Stock ${selectedVariant?.stock}`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {validVariants.map((v, index) => {
              const active = selectedVariant?.sku === v.sku;
              const label = v.colorName || v.color || `Color ${index + 1}`;
              const preview = v.images?.[0];

              return (
                <button
                  key={v.sku || index}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`min-w-[76px] rounded-xl border p-2 text-left transition md:min-w-[120px] md:rounded-2xl ${
                    active
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border md:h-7 md:w-7"
                      style={{ backgroundColor: v.colorCode || "#e5e7eb" }}
                    />

                    <span className="line-clamp-1 text-[10px] font-black md:text-sm">
                      {label}
                    </span>
                  </div>

                  {preview && (
                    <img
                      src={preview}
                      alt={label}
                      className="mt-2 h-12 w-full rounded-lg bg-gray-50 object-contain md:h-20"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}