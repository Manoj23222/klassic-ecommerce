import mongoose, { Schema, models } from "mongoose";

const AttributeRuleSchema = new Schema(
  {
    category_id: {
      type: String,
      required: true,
      index: true,
    },

    category_name: {
      type: String,
      default: "",
    },

    fieldName: {
      type: String,
      required: true,
      trim: true,
    },

    fieldKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    fieldType: {
      type: String,
      enum: [
        "text",
        "textarea",
        "number",
        "dropdown",
        "checkbox",
        "radio",
        "color",
        "date",
      ],
      default: "text",
    },

    options: {
      type: [String],
      default: [],
    },

    placeholder: {
      type: String,
      default: "",
    },

    unit: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    filterable: {
      type: Boolean,
      default: false,
    },

    showOnProductPage: {
      type: Boolean,
      default: true,
    },

    searchable: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

AttributeRuleSchema.index({
  category_id: 1,
});

AttributeRuleSchema.index({
  fieldKey: 1,
});

AttributeRuleSchema.index({
  filterable: 1,
});

export default models.AttributeRule ||
  mongoose.model(
    "AttributeRule",
    AttributeRuleSchema
  );