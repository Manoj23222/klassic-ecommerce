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
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    store_name: {
      type: String,
      required: true,
    },

    business_type: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    pan: {
      type: String,
      default: "",
    },

    gst: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Pending",
    },

    /* STORE PROFILE */

    store_description: {
      type: String,
      default: "",
    },

    support_email: {
      type: String,
      default: "",
    },

    support_phone: {
      type: String,
      default: "",
    },

    store_logo: {
      type: String,
      default: "",
    },

    store_banner: {
      type: String,
      default: "",
    },

    /* BANK DETAILS */

    bank_account_holder: {
      type: String,
      default: "",
    },

    bank_name: {
      type: String,
      default: "",
    },

    bank_account_number: {
      type: String,
      default: "",
    },

    bank_ifsc: {
      type: String,
      default: "",
    },

    upi_id: {
      type: String,
      default: "",
    },

    /* GST DETAILS */

    gst_number: {
      type: String,
      default: "",
    },

    pan_number: {
      type: String,
      default: "",
    },

    business_name: {
      type: String,
      default: "",
    },

    business_address: {
      type: String,
      default: "",
    },

    /* STORE SETTINGS */

    store_visibility: {
      type: String,
      default: "Public",
    },

    return_policy: {
      type: String,
      default: "",
    },

    shipping_policy: {
      type: String,
      default: "",
    },

    auto_approve_orders: {
      type: Boolean,
      default: false,
    },

    /* KLASSIC UNIQUE */

    trust_score: {
      type: Number,
      default: 60,
    },

    seller_level: {
      type: String,
      default: "New Seller",
    },

    reward_points: {
      type: Number,
      default: 0,
    },

    reset_token: {
      type: String,
      default: "",
    },

    reset_token_expiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Seller ||
  mongoose.model("Seller", SellerSchema);