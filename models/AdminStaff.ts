import mongoose, { Schema, models } from "mongoose";

const AdminStaffSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },

    role: {
      type: String,
      enum: ["Super Admin", "Admin", "Manager", "Support", "Finance", "Inventory"],
      default: "Admin",
    },

    permissions: {
      dashboard: { type: Boolean, default: true },
      products: { type: Boolean, default: false },
      orders: { type: Boolean, default: false },
      sellers: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
      finance: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
      settings: { type: Boolean, default: false },
      staff: { type: Boolean, default: false },
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    last_login: { type: Date },
    created_by: { type: String },
  },
  { timestamps: true }
);

export default models.AdminStaff ||
  mongoose.model("AdminStaff", AdminStaffSchema);