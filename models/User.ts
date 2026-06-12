import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    reset_token: {
      type: String,
      default: "",
    },

    reset_token_expiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);