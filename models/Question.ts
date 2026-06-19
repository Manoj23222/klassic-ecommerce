import mongoose, { Schema, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      default: "",
    },

    customer_name: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    answered_by: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Answered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Question ||
  mongoose.model("Question", QuestionSchema);