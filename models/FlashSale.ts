import mongoose, { Schema, models } from "mongoose";

const FlashSaleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    product_ids: {
      type: [String],
      default: [],
    },

    discount_percent: {
      type: Number,
      default: 0,
    },

    start_date: {
      type: Date,
      required: true,
    },

    end_date: {
      type: Date,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.FlashSale ||
  mongoose.model("FlashSale", FlashSaleSchema);