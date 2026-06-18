import mongoose, { Schema, models } from "mongoose";

const AdminSecurityLogSchema = new Schema(
  {
    admin_id: { type: String },
    admin_email: { type: String },
    action: { type: String, required: true },
    module: { type: String, default: "System" },
    ip_address: { type: String },
    user_agent: { type: String },
    status: {
      type: String,
      enum: ["Success", "Failed", "Warning"],
      default: "Success",
    },
    note: { type: String },
  },
  { timestamps: true }
);

export default models.AdminSecurityLog ||
  mongoose.model("AdminSecurityLog", AdminSecurityLogSchema);