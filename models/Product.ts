import mongoose, { Schema, models } from "mongoose";

const VariantSchema = new Schema(
  {
    colorName: { type: String, default: "" },
    colorCode: { type: String, default: "#000000" },
    color: { type: String, default: "" },

    size: { type: String, default: "" },
    material: { type: String, default: "" },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    price: { type: Number, required: true, default: 0 },
    sale_price: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    regularPrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    lowStock: { type: Number, default: 0 },

    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    isDefault: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of Stock"],
      default: "Active",
    },
  },
  { _id: true }
);

const ProductSchema = new Schema(
  
  {
    
    seller_id: { type: String, default: "" },
    seller_store_name: { type: String, default: "" },

    name: { type: String, required: true },
    short_description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    brand: { type: String, default: "" },
    brandVerified: { type: Boolean, default: false },

    tags: { type: [String], default: [] },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },

    default_variant_sku: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    price: { type: Number, required: true, default: 0 },
    regularPrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    sale_price: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    lowStock: { type: Number, default: 0 },
    stockStatus: { type: String, default: "In Stock" },

    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    gallery_images: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },

    category: { type: String, default: "General" },
    sub_category: { type: String, default: "" },
    subcategory: { type: String, default: "" },

    category_id: { type: String, default: "" },
    category_slug: { type: String, default: "" },
    category_path: { type: [String], default: [] },
    leaf_category: { type: String, default: "" },

    attributes: { type: Schema.Types.Mixed, default: {} },

    hsnCode: { type: String, default: "" },
    gst: { type: Number, default: 0 },
    countryOfOrigin: { type: String, default: "India" },

    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    material: { type: String, default: "" },
    weight: { type: String, default: "" },
    quantityOptions: { type: [String], default: [] },
quantities: { type: [String], default: [] },
weightOptions: { type: [String], default: [] },

    variants: { type: [VariantSchema], default: [] },
    color_variants: { type: [VariantSchema], default: [] },

    specifications: { type: [Schema.Types.Mixed], default: [] },

    shipping: {
      packageWeight: { type: Number, default: 0 },
      packageLength: { type: Number, default: 0 },
      packageWidth: { type: Number, default: 0 },
      packageHeight: { type: Number, default: 0 },
      shippingWeight: { type: String, default: "" },
      length: { type: String, default: "" },
      width: { type: String, default: "" },
      height: { type: String, default: "" },
      shippingCharges: { type: Number, default: 0 },
      freeShipping: { type: Boolean, default: true },
      weightUnit: { type: String, default: "kg" },
      dimensionUnit: { type: String, default: "cm" },
    },

    returnPolicy: { type: Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected", "Draft"],
      default: "Pending Approval",
    },

    featured: { type: Boolean, default: false },
    flashSale: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },

    seo: { type: Schema.Types.Mixed, default: {} },
    features: { type: [String], default: [] },

    reject_reason: { type: String, default: "" },
    approval_comment: { type: String, default: "" },
    approved_by: { type: String, default: "" },
    approved_at: { type: Date, default: null },
    rejected_by: { type: String, default: "" },
    rejected_at: { type: Date, default: null },
    admin_notes: { type: String, default: "" },

    ai_score: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    sales_count: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  
  { timestamps: true }
  
);

ProductSchema.pre("validate", function () {
  const product: any = this;

  if (!Array.isArray(product.variants)) product.variants = [];

  product.variants = product.variants.map((v: any, index: number) => {
    const variantSku = String(
      v.sku || `${product.sku || "KL"}-V${index + 1}`
    )
      .trim()
      .toUpperCase();

    const variantImages = Array.isArray(v.images)
      ? v.images.filter(Boolean)
      : v.image
      ? [v.image]
      : product.image
      ? [product.image]
      : [];

    return {
      ...v,
      colorName: v.colorName || v.color || "",
      color: v.color || v.colorName || "",
      colorCode: v.colorCode || "#000000",

      sku: variantSku,

      price: Number(v.price || product.price || 0),
      sale_price: Number(
        v.sale_price ||
          v.salePrice ||
          product.sale_price ||
          product.salePrice ||
          0
      ),
      salePrice: Number(
        v.salePrice ||
          v.sale_price ||
          product.salePrice ||
          product.sale_price ||
          0
      ),
      regularPrice: Number(
        v.regularPrice || product.regularPrice || product.price || 0
      ),

      stock: Number(v.stock || 0),
      images: variantImages,
      image: v.image || variantImages[0] || product.image || "",
      isDefault: Boolean(v.isDefault),
    };
  });

  if (product.variants.length > 0) {
    const hasDefault = product.variants.some((v: any) => v.isDefault);

    if (!hasDefault) {
      product.variants[0].isDefault = true;
    }

    const defaultVariant =
      product.variants.find((v: any) => v.isDefault) || product.variants[0];

    product.default_variant_sku = defaultVariant.sku;

    if (!product.sku || String(product.sku).trim() === "") {
      product.sku = defaultVariant.sku;
    }

    product.price = Number(defaultVariant.price || product.price || 0);

    const finalSalePrice = Number(
      defaultVariant.sale_price ||
        defaultVariant.salePrice ||
        product.sale_price ||
        product.salePrice ||
        0
    );

    product.sale_price = finalSalePrice;
    product.salePrice = finalSalePrice;

    product.stock = product.variants.reduce(
      (sum: number, v: any) => sum + Number(v.stock || 0),
      0
    );

    product.image =
      product.image || defaultVariant.image || defaultVariant.images?.[0] || "";

    if (
      defaultVariant.images?.length > 0 &&
      (!product.gallery_images || product.gallery_images.length === 0)
    ) {
      product.gallery_images = defaultVariant.images;
    }

    product.colors = [
      ...new Set(
        product.variants
          .map((v: any) => v.colorName || v.color)
          .filter(Boolean)
      ),
    ];

    product.color_variants = product.variants;
  }

  product.stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";

  if (!product.salePrice && product.sale_price) {
    product.salePrice = product.sale_price;
  }

  if (!product.sale_price && product.salePrice) {
    product.sale_price = product.salePrice;
  }

  if (!product.short_description && product.shortDescription) {
    product.short_description = product.shortDescription;
  }

  if (!product.shortDescription && product.short_description) {
    product.shortDescription = product.short_description;
  }

  if (!product.sub_category && product.subcategory) {
    product.sub_category = product.subcategory;
  }

  if (!product.subcategory && product.sub_category) {
    product.subcategory = product.sub_category;
  }
});

ProductSchema.index({ seller_id: 1, createdAt: -1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ category_slug: 1 });
ProductSchema.index({ category_id: 1 });
ProductSchema.index({ leaf_category: 1 });
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ "variants.sku": 1 });
ProductSchema.index({ "color_variants.sku": 1 });
ProductSchema.index({
  "attributeMeta.fieldKey": 1,
});

export default models.Product || mongoose.model("Product", ProductSchema);