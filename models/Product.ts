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

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
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
    },

    status: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected", "Draft"],
      default: "Pending Approval",
    },

    featured: {
      type: Boolean,
      default: false,
    },
    rejection_reason: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

export default models.Product || mongoose.model("Product", ProductSchema);