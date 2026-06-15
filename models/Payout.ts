import mongoose, { Schema, models } from "mongoose";

const PayoutSchema = new Schema(
  {
    seller_id: {
      type: String,
      required: true,
    },

    seller_store_name: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    commission_amount: {
      type: Number,
      default: 0,
    },

    net_amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Paid", "Rejected"],
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

    note: {
      type: String,
      default: "",
    },

    paid_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Payout || mongoose.model("Payout", PayoutSchema);