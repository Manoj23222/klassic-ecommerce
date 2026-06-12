import mongoose, { Schema, models } from "mongoose";

const OtpSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    expires_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Otp || mongoose.model("Otp", OtpSchema);