import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product_id: { type: String, required: true },
    seller_id: { type: String, default: "" },
    seller_store_name: { type: String, default: "" },

    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },

    color: { type: String, default: "" },
    size: { type: String, default: "" },
    image: { type: String, default: "" },

    item_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user_id: { type: String, default: "" },

    total_amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    payment_method: { type: String, default: "COD" },

    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    coupon_code: { type: String, default: "" },
    discount: { type: Number, default: 0 },

    items: {
      type: [OrderItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);