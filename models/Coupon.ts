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

    type: {
      type: String,
      enum: ["fixed", "percent"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.Coupon || mongoose.model("Coupon", CouponSchema);