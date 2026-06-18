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
      enum: [
        "Pending",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Return Approved",
        "Return Rejected",
        "Refund Pending",
        "Refunded",
      ],
      default: "Pending",
    },

    tracking_number: { type: String, default: "" },
    courier_name: { type: String, default: "" },
    delivery_estimate: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user_id: { type: String, default: "" },

    customer_name: { type: String, required: true },
    phone: { type: String, required: true },

    address: { type: String, required: true },
    pincode: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    landmark: { type: String, default: "" },
    address_type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    items: {
      type: [OrderItemSchema],
      default: [],
    },

    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    delivery_charge: { type: Number, default: 0 },
    gst_amount: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },

    coupon_code: { type: String, default: "" },

    payment_method: {
      type: String,
      enum: ["COD", "UPI", "Card", "Wallet", "Net Banking", "EMI", "Paytm"],
      default: "COD",
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    payment_id: { type: String, default: "" },
    gateway_order_id: { type: String, default: "" },
    transaction_id: { type: String, default: "" },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Return Approved",
        "Return Rejected",
        "Refund Pending",
        "Refunded",
      ],
      default: "Pending",
    },

    order_note: { type: String, default: "" },

    return_reason: { type: String, default: "" },
    return_status: {
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected"],
      default: "None",
    },
    return_requested_at: { type: Date, default: null },
    return_action_at: { type: Date, default: null },

    refund_amount: { type: Number, default: 0 },
    refund_status: {
      type: String,
      enum: ["None", "Pending", "Completed", "Rejected"],
      default: "None",
    },
    refund_note: { type: String, default: "" },
    refunded_at: { type: Date, default: null },

    invoice_number: { type: String, default: "" },
    invoice_url: { type: String, default: "" },

    cancelled_reason: { type: String, default: "" },
    cancelled_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);