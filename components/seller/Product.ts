import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    seller_id: { type: String, required: true },
    seller_store_name: { type: String, default: "" },

    name: { type: String, required: true },
    description: { type: String, default: "" },
    short_description: { type: String, default: "" },

    price: { type: Number, required: true },
    sale_price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    image: { type: String, default: "" },
    gallery_images: [{ type: String }],

    category: { type: String, default: "General" },
    sub_category: { type: String, default: "" },

    sku: { type: String, default: "" },
    brand: { type: String, default: "" },
    tags: { type: String, default: "" },

    colors: { type: String, default: "" },
    sizes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Rejected"],
      default: "Pending Approval",
    },

    reject_reason: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);