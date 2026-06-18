import mongoose, { Schema, models } from "mongoose";

const WithdrawRequestSchema = new Schema(
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

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    bank_name: {
      type: String,
      default: "",
    },

    account_holder: {
      type: String,
      default: "",
    },

    account_number: {
      type: String,
      default: "",
    },

    ifsc_code: {
      type: String,
      default: "",
    },

    upi_id: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Paid",
      ],
      default: "Pending",
    },

    admin_note: {
      type: String,
      default: "",
    },

    paid_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

WithdrawRequestSchema.index({
  seller_id: 1,
  status: 1,
});

export default models.WithdrawRequest ||
  mongoose.model(
    "WithdrawRequest",
    WithdrawRequestSchema
  );