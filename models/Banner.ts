import mongoose, { Schema, models } from "mongoose";

const BannerSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      required: true,
    },

    button_text: {
      type: String,
      default: "",
    },

    button_link: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      enum: [
        "Home Top",
        "Home Middle",
        "Category",
        "Mobile App",
      ],
      default: "Home Top",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Banner ||
  mongoose.model("Banner", BannerSchema);