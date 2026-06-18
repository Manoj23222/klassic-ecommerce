import mongoose, { Schema, models } from "mongoose";

const WalletTransactionSchema = new Schema(
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

    payout_id: {
      type: String,
      default: "",
      index: true,
    },

    order_id: {
      type: String,
      default: "",
      index: true,
    },

    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    balance_after: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    description: {
      type: String,
      default: "",
    },

    reference_id: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

WalletTransactionSchema.index({ seller_id: 1, createdAt: -1 });
WalletTransactionSchema.index({ status: 1 });

export default models.WalletTransaction ||
  mongoose.model("WalletTransaction", WalletTransactionSchema);