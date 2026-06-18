"use client";

export default function ProductSpecifications({ product }: { product: any }) {
  const dynamicAttributes = product?.attributes || {};

  const baseSpecs = [
    { key: "Brand", value: product?.brand || "-" },
    {
      key: "SKU",
      value: product?.default_variant_sku || product?.sku || "-",
    },
    {
      key: "Category",
      value:
        product?.leaf_category ||
        product?.sub_category ||
        product?.category ||
        "-",
    },
    {
      key: "Color",
      value: product?.color || "-",
    },
    {
      key: "Country Of Origin",
      value: product?.countryOfOrigin || "India",
    },
    { key: "HSN Code", value: product?.hsnCode || "-" },
    { key: "GST", value: product?.gst ? `${product.gst}%` : "-" },
  ];

  const attributeSpecs = Object.entries(dynamicAttributes).map(
    ([key, value]) => ({
      key: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: String(value || "-"),
    })
  );

  const allSpecs = [...baseSpecs, ...attributeSpecs].filter(
    (item) =>
      item.value !== "" &&
      item.value !== "-" &&
      item.value !== "undefined"
  );

  if (allSpecs.length === 0) {
    return <p className="text-sm text-gray-500">No specifications available.</p>;
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white">
      {allSpecs.map((item, index) => (
        <div
          key={`${item.key}-${index}`}
          className="grid grid-cols-[42%_58%] border-b border-gray-100 last:border-b-0"
        >
          <div className="bg-gray-50/70 px-4 py-4 text-sm font-semibold text-gray-500">
            {item.key}
          </div>

          <div className="px-4 py-4 text-sm font-bold text-gray-900">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}