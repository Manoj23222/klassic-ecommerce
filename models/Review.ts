import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      default: "",
    },

    order_id: {
      type: String,
      default: "",
    },

    customer_name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Review ||
  mongoose.model("Review", ReviewSchema);