import mongoose, { Schema, models } from "mongoose";

const SellerCampaignSchema = new Schema(
  {
    seller_id: { type: String, required: true, index: true },
    seller_store_name: { type: String, default: "" },

    type: {
      type: String,
      enum: ["Banner", "Coupon", "Campaign"],
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    imageUrl: { type: String, default: "" },
    link: { type: String, default: "" },

    couponCode: { type: String, default: "", uppercase: true },
    discount: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },

    budget: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Draft", "Active", "Paused", "Ended"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

SellerCampaignSchema.index({ seller_id: 1, type: 1, createdAt: -1 });

export default models.SellerCampaign ||
  mongoose.model("SellerCampaign", SellerCampaignSchema);