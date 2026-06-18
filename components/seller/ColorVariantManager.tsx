"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export type ColorVariant = {
  colorName: string;
  colorCode: string;
  color: string;
  size?: string;
  sku: string;
  stock: string | number;
  price: string | number;
  sale_price: string | number;
  salePrice?: string | number;
  regularPrice?: string | number;
  image: string;
  images: string[];
  isDefault?: boolean;
};

export default function ColorVariantManager({
  variants,
  setVariants,
  uploadImage,
}: {
  variants: ColorVariant[];
  setVariants: (variants: ColorVariant[]) => void;
  uploadImage: (file: File) => Promise<string>;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const totalStock = useMemo(() => {
    return variants.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  }, [variants]);

  function makeSku(colorName: string) {
    const clean = colorName
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 5)
      .toUpperCase();

    return `KL-${clean || "COLOR"}-${Date.now().toString().slice(-5)}`;
  }

  function addVariant() {
    const colorName = "";

    setVariants([
      ...variants,
      {
  colorName,
  colorCode: "#000000",
  color: colorName,
  size: "",
  sku: makeSku("COLOR"),
  stock: "",
  price: "",
  sale_price: "",
  salePrice: "",
  regularPrice: "",
  image: "",
  images: [],
  isDefault: variants.length === 0,
}
    ]);
  }

  function updateVariant(index: number, key: keyof ColorVariant, value: any) {
    const copy = [...variants];

    copy[index] = {
      ...copy[index],
      [key]: value,
    };

    if (key === "colorName") {
      copy[index].color = value;

      if (!copy[index].sku || copy[index].sku.startsWith("KL-COLOR")) {
        copy[index].sku = makeSku(value);
      }
    }

    if (key === "sale_price") {
      copy[index].salePrice = value;
    }

    if (key === "salePrice") {
      copy[index].sale_price = value;
    }

    setVariants(copy);
  }

  function removeVariant(index: number) {
    const next = variants.filter((_, i) => i !== index);

    if (next.length > 0 && !next.some((v) => v.isDefault)) {
      next[0].isDefault = true;
    }

    setVariants(next);
  }

  function setDefault(index: number) {
    setVariants(
      variants.map((variant, i) => ({
        ...variant,
        isDefault: i === index,
      }))
    );
  }

  async function uploadVariantImages(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      setUploadingIndex(index);
      toast.loading("Uploading variant images...");

      const uploaded = await Promise.all(Array.from(files).map(uploadImage));

      const copy = [...variants];

      const oldImages = Array.isArray(copy[index].images)
        ? copy[index].images
        : [];

      const images = [...oldImages, ...uploaded];

      copy[index] = {
        ...copy[index],
        images,
        image: copy[index].image || images[0] || "",
      };

      setVariants(copy);

      toast.dismiss();
      toast.success("Variant images uploaded");
    } catch {
      toast.dismiss();
      toast.error("Variant image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  }

  function removeImage(variantIndex: number, imageIndex: number) {
    const copy = [...variants];

    const images = copy[variantIndex].images.filter(
      (_, i) => i !== imageIndex
    );

    copy[variantIndex] = {
      ...copy[variantIndex],
      images,
      image:
        copy[variantIndex].image === copy[variantIndex].images[imageIndex]
          ? images[0] || ""
          : copy[variantIndex].image,
    };

    setVariants(copy);
  }

  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Color Variants / Child SKUs
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Har color ka alag SKU, price, stock aur images upload karo.
          </p>
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          + Add Color
        </button>
      </div>

      <div className="mb-4 rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-700">
        Total Variants: {variants.length} | Total Stock: {totalStock}
      </div>

      {variants.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center">
          <p className="font-bold text-gray-700">
            No color variant added yet.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Agar product me multiple colors hain to Add Color par click karo.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {variants.map((variant, index) => (
            <div
              key={index}
              className={`rounded-3xl border p-4 ${
                variant.isDefault
                  ? "border-green-400 bg-green-50/40"
                  : "bg-white"
              }`}
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-full border shadow-sm"
                    style={{
                      backgroundColor: variant.colorCode || "#000000",
                    }}
                  />

                  <div>
                    <p className="font-black">
                      {variant.colorName || "New Color"}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      SKU: {variant.sku || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDefault(index)}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${
                      variant.isDefault
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {variant.isDefault ? "Default" : "Set Default"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Color Name *"
                  value={variant.colorName}
                  setValue={(v) => updateVariant(index, "colorName", v)}
                  placeholder="Black / Red / Blue"
                />

                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-gray-700">
                    Color Code
                  </span>
                  <input
                    type="color"
                    value={variant.colorCode || "#000000"}
                    onChange={(e) =>
                      updateVariant(index, "colorCode", e.target.value)
                    }
                    className="h-[50px] w-full rounded-2xl border bg-white p-2"
                  />
                </label>

                <Input
                  label="Variant SKU *"
                  value={variant.sku}
                  setValue={(v) =>
                    updateVariant(index, "sku", v.toUpperCase())
                  }
                />

                <Input
                  label="MRP / Regular Price"
                  value={String(variant.regularPrice || "")}
                  setValue={(v) => updateVariant(index, "regularPrice", v)}
                  type="number"
                />

                <Input
                  label="Selling Price"
                  value={String(variant.sale_price || "")}
                  setValue={(v) => updateVariant(index, "sale_price", v)}
                  type="number"
                />

                <Input
                  label="Stock"
                  value={String(variant.stock || "")}
                  setValue={(v) => updateVariant(index, "stock", v)}
                  type="number"
                />
              </div>

              <div className="mt-5 rounded-2xl border bg-gray-50 p-4">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black">Variant Images</p>
                    <p className="text-xs text-gray-500">
                      Ye images color select karne par product page me load hongi.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingIndex === index}
                    onChange={(e) =>
                      uploadVariantImages(index, e.target.files)
                    }
                    className="rounded-xl border bg-white p-2 text-sm"
                  />
                </div>

                {variant.images?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {variant.images.map((img, imageIndex) => (
                      <div
                        key={`${img}-${imageIndex}`}
                        className="rounded-2xl border bg-white p-2"
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-28 w-full rounded-xl object-contain"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index, imageIndex)}
                          className="mt-2 w-full rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed bg-white p-5 text-center text-sm font-semibold text-gray-500">
                    No variant image uploaded.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Input({
  label,
  value,
  setValue,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
      />
    </label>
  );
}