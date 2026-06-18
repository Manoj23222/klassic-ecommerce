import mongoose, { Schema, models } from "mongoose";

const SellerBadgeSchema = new Schema(
  {
    seller_id: {
      type: String,
      required: true,
      index: true,
    },

    seller_store_name: {
      type: String,
      default: "",
    },

    badge_name: {
      type: String,
      required: true,
    },

    badge_icon: {
      type: String,
      default: "🏆",
    },

    badge_color: {
      type: String,
      default: "gold",
    },

    description: {
      type: String,
      default: "",
    },

    earned_at: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Hidden"],
      default: "Active",
    },
  },
  { timestamps: true }
);

SellerBadgeSchema.index({
  seller_id: 1,
  badge_name: 1,
});

export default models.SellerBadge ||
  mongoose.model("SellerBadge", SellerBadgeSchema);