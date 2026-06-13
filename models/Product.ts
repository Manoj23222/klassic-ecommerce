import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    seller_id: {
      type: String,
      default: "",
    },

    seller_store_name: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
    },

    short_description: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    tags: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    sale_price: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    gallery_images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "General",
    },

    sub_category: {
      type: String,
      default: "",
    },

    colors: {
      type: String,
      default: "",
    },

    sizes: {
      type: String,
      default: "",
    },

    sku: {
      type: String,
      default: "",
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "Pending Approval",
        "Approved",
        "Rejected",
        "Draft",
      ],
      default: "Pending Approval",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    reject_reason: {
      type: String,
      default: "",
    },

    ai_score: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    sales_count: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product ||
  mongoose.model("Product", ProductSchema);