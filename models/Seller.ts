import mongoose, { Schema, models } from "mongoose";

const SellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    password: {
      type: String,
      required: true,
    },

    store_name: {
      type: String,
      required: true,
    },

    business_type: String,

    category: String,

    pan: String,

    gst: String,

    address: String,

    status: {
      type: String,
      default: "Pending",
    },

    reset_token: String,

    reset_token_expiry: Date,
  },
  {
    timestamps: true,
  }
);

export default models.Seller ||
  mongoose.model("Seller", SellerSchema);