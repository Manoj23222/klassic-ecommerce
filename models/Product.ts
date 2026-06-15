import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    seller_id: { type: String, default: "" },
    seller_store_name: { type: String, default: "" },

    name: { type: String, required: true },
    short_description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    brand: { type: String, default: "" },

    tags: { type: [String], default: [] },

    price: { type: Number, required: true },
    regularPrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    sale_price: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },

    stock: { type: Number, default: 0 },
    lowStock: { type: Number, default: 0 },
    stockStatus: { type: String, default: "In Stock" },

    image: { type: String, default: "" },
    gallery_images: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },

    category: { type: String, default: "General" },
    sub_category: { type: String, default: "" },
    subcategory: { type: String, default: "" },

    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    material: { type: String, default: "" },
    weight: { type: String, default: "" },

    sku: { type: String, default: "", unique: true, sparse: true },

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
    specifications: { type: [Schema.Types.Mixed], default: [] },
    shipping: { type: Schema.Types.Mixed, default: {} },
    returnPolicy: { type: Schema.Types.Mixed, default: {} },

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

export default models.Product || mongoose.model("Product", ProductSchema);