"use client";

type Variant = {
  color?: string;
  colorName?: string;
  colorCode?: string;
  sku?: string;
  price?: number | string;
  sale_price?: number | string;
  salePrice?: number | string;
  stock?: number | string;
  image?: string;
  images?: string[];
};

export default function VariantSelector({
  variants,
  selectedVariant,
  setSelectedVariant,
  productImage,
  onImageChange,
}: {
  variants: Variant[];
  selectedVariant: Variant | null;
  setSelectedVariant: (variant: Variant) => void;
  productImage?: string;
  onImageChange?: (image: string) => void;
}) {
  if (!variants || variants.length === 0) return null;

  const selectedColor =
    selectedVariant?.colorName || selectedVariant?.color || "Default";

  return (
    <section className="rounded-xl bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black sm:text-base">
          Selected Color:{" "}
          <span className="text-blue-600">{selectedColor}</span>
        </h2>

        <span className="text-xs font-bold text-gray-500">
          SKU: {selectedVariant?.sku || "N/A"}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {variants.map((variant, index) => {
          const active =
            selectedVariant?.sku === variant.sku ||
            selectedVariant === variant;

          const img =
            variant.image ||
            (Array.isArray(variant.images) && variant.images.length > 0
              ? variant.images[0]
              : "") ||
            productImage ||
            "/placeholder.png";

          return (
            <button
              key={variant.sku || `${variant.colorName}-${index}`}
              type="button"
              onClick={() => {
                setSelectedVariant(variant);
                onImageChange?.(img);
              }}
              className={`min-w-[78px] rounded-xl border-2 bg-white p-1.5 transition ${
                active
                  ? "border-blue-600 shadow-md ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              title={variant.colorName || variant.color || "Color"}
            >
              <div className="h-16 w-full rounded-lg bg-gray-50">
                <img
                  src={img}
                  alt={variant.colorName || variant.color || "Color"}
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="mt-1 line-clamp-1 text-[11px] font-bold">
                {variant.colorName || variant.color || "Color"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}