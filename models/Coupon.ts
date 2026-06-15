import mongoose, { Schema, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["fixed", "percent"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    min_order_amount: {
      type: Number,
      default: 0,
    },

    max_discount: {
      type: Number,
      default: 0,
    },

    usage_limit: {
      type: Number,
      default: 100,
    },

    used_count: {
      type: Number,
      default: 0,
    },

    start_date: {
      type: Date,
      default: Date.now,
    },

    expiry_date: {
      type: Date,
      default: null,
    },

    customer_only: {
      type: Boolean,
      default: false,
    },

    new_user_only: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Coupon ||
  mongoose.model("Coupon", CouponSchema);