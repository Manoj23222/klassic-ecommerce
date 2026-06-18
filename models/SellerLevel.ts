import mongoose, { Schema, models } from "mongoose";

const SellerLevelSchema = new Schema(
  {
    seller_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    seller_store_name: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      enum: [
        "New Seller",
        "Bronze Seller",
        "Silver Seller",
        "Gold Seller",
        "Platinum Seller",
        "Elite Seller",
      ],
      default: "New Seller",
    },

    xp_points: {
      type: Number,
      default: 0,
    },

    total_orders: {
      type: Number,
      default: 0,
    },

    total_sales: {
      type: Number,
      default: 0,
    },

    trust_score: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

export default models.SellerLevel ||
  mongoose.model("SellerLevel", SellerLevelSchema);