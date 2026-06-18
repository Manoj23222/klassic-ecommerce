import mongoose, { Schema, models } from "mongoose";

const PayoutSchema = new Schema(
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

    order_id: {
      type: String,
      default: "",
      index: true,
    },

    sale_amount: {
      type: Number,
      default: 0,
    },

    commission_rate: {
      type: Number,
      default: 0,
    },

    commission_amount: {
      type: Number,
      default: 0,
    },

    shipping_charge: {
      type: Number,
      default: 0,
    },

    payout_amount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Paid", "Rejected"],
      default: "Pending",
    },

    payment_method: {
      type: String,
      default: "Bank Transfer",
    },

    transaction_id: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    approved_at: {
      type: Date,
      default: null,
    },

    paid_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

PayoutSchema.index({ seller_id: 1, status: 1 });
PayoutSchema.index({ status: 1, createdAt: -1 });

export default models.Payout || mongoose.model("Payout", PayoutSchema);