import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    parent_id: {
      type: String,
      default: "",
      index: true,
    },

    level: {
      type: Number,
      default: 1,
    },

    path: {
      type: [String],
      default: [],
    },

    isLeaf: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    productCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },
    showInMenu: {
  type: Boolean,
  default: true,
},

featured: {
  type: Boolean,
  default: false,
},

sellerAllowed: {
  type: Boolean,
  default: true,
},

defaultGst: {
  type: Number,
  default: 0,
},

hsnCode: {
  type: String,
  default: "",
},

seoKeywords: {
  type: String,
  default: "",
},

dynamicAttributes: {
  type: [String],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent_id: 1 });
CategorySchema.index({ level: 1 });
CategorySchema.index({ status: 1 });
CategorySchema.index({ isLeaf: 1 });
CategorySchema.index({ commissionRate: 1 });

export default models.Category ||
  mongoose.model("Category", CategorySchema);