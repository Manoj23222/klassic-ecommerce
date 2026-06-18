import mongoose, { Schema, models } from "mongoose";

const ProductApprovalLogSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
      index: true,
    },

    seller_id: {
      type: String,
      default: "",
      index: true,
    },

    seller_store_name: {
      type: String,
      default: "",
    },

    product_name: {
      type: String,
      default: "",
    },

    sku: {
      type: String,
      default: "",
      uppercase: true,
    },

    action: {
      type: String,
      enum: [
        "Submitted",
        "Approved",
        "Rejected",
        "Resubmitted",
      ],
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    comment: {
      type: String,
      default: "",
    },

    admin_id: {
      type: String,
      default: "",
    },

    admin_name: {
      type: String,
      default: "",
    },

    ai_score: {
      type: Number,
      default: 0,
    },

    image_quality_score: {
      type: Number,
      default: 0,
    },

    seo_score: {
      type: Number,
      default: 0,
    },

    duplicate_score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductApprovalLogSchema.index({
  product_id: 1,
  createdAt: -1,
});

ProductApprovalLogSchema.index({
  action: 1,
});

export default models.ProductApprovalLog ||
  mongoose.model(
    "ProductApprovalLog",
    ProductApprovalLogSchema
  );