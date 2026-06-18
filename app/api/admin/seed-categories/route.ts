import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import AttributeRule from "@/models/AttributeRule";

export const dynamic = "force-dynamic";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const categoryTree = [
  {
    name: "Electronics",
    children: [
      {
        name: "Mobiles & Accessories",
        children: [
          {
            name: "Smartphones",
            fields: [
              {
                name: "ram",
                label: "RAM",
                type: "dropdown",
                options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"],
                required: true,
              },
              {
                name: "storage",
                label: "Storage",
                type: "dropdown",
                options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
                required: true,
              },
              {
                name: "processor",
                label: "Processor",
                type: "text",
                required: true,
              },
              {
                name: "battery",
                label: "Battery Capacity",
                type: "number",
                unit: "mAh",
                required: true,
              },
              {
                name: "camera",
                label: "Camera",
                type: "text",
                required: false,
              },
            ],
          },
          {
            name: "Mobile Covers",
            fields: [
              {
                name: "compatible_model",
                label: "Compatible Model",
                type: "text",
                required: true,
              },
              {
                name: "material",
                label: "Material",
                type: "dropdown",
                options: ["Silicone", "Plastic", "Leather", "TPU", "Metal"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "Audio",
        children: [
          {
            name: "Neckbands",
            fields: [
              {
                name: "bluetooth_version",
                label: "Bluetooth Version",
                type: "dropdown",
                options: ["5.0", "5.1", "5.2", "5.3", "5.4"],
                required: true,
              },
              {
                name: "battery_backup",
                label: "Battery Backup",
                type: "number",
                unit: "Hours",
                required: true,
              },
              {
                name: "fast_charging",
                label: "Fast Charging",
                type: "dropdown",
                options: ["Yes", "No"],
                required: true,
              },
              {
                name: "water_resistant",
                label: "Water Resistant",
                type: "dropdown",
                options: ["Yes", "No"],
                required: false,
              },
            ],
          },
          {
            name: "Headphones",
            fields: [
              {
                name: "headphone_type",
                label: "Headphone Type",
                type: "dropdown",
                options: ["On Ear", "Over Ear", "In Ear"],
                required: true,
              },
              {
                name: "connectivity",
                label: "Connectivity",
                type: "dropdown",
                options: ["Wired", "Wireless"],
                required: true,
              },
              {
                name: "noise_cancellation",
                label: "Noise Cancellation",
                type: "dropdown",
                options: ["Yes", "No"],
                required: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Fashion",
    children: [
      {
        name: "Men",
        children: [
          {
            name: "T-Shirts",
            fields: [
              {
                name: "fabric",
                label: "Fabric",
                type: "dropdown",
                options: ["Cotton", "Polyester", "Lycra", "Blend"],
                required: true,
              },
              {
                name: "fit_type",
                label: "Fit Type",
                type: "dropdown",
                options: ["Regular", "Slim", "Oversized"],
                required: true,
              },
              {
                name: "neck_type",
                label: "Neck Type",
                type: "dropdown",
                options: ["Round Neck", "V-Neck", "Polo"],
                required: true,
              },
            ],
          },
          {
            name: "Shoes",
            fields: [
              {
                name: "shoe_type",
                label: "Shoe Type",
                type: "dropdown",
                options: ["Casual", "Sports", "Formal", "Sneakers"],
                required: true,
              },
              {
                name: "sole_material",
                label: "Sole Material",
                type: "text",
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "Women",
        children: [
          {
            name: "Kurtis",
            fields: [
              {
                name: "fabric",
                label: "Fabric",
                type: "dropdown",
                options: ["Cotton", "Rayon", "Silk", "Georgette"],
                required: true,
              },
              {
                name: "sleeve_type",
                label: "Sleeve Type",
                type: "dropdown",
                options: ["Sleeveless", "Half Sleeve", "Full Sleeve"],
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Home",
    children: [
      {
        name: "Furniture",
        children: [
          {
            name: "Chairs",
            fields: [
              {
                name: "primary_material",
                label: "Primary Material",
                type: "dropdown",
                options: ["Wood", "Metal", "Plastic", "Fabric"],
                required: true,
              },
              {
                name: "assembly_required",
                label: "Assembly Required",
                type: "dropdown",
                options: ["Yes", "No"],
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

async function createNode({
  node,
  parentId = "",
  level = 1,
  path = [],
}: {
  node: any;
  parentId?: string;
  level?: number;
  path?: string[];
}) {
  const slug = slugify([...path, node.name].join("-"));

  const category = await Category.findOneAndUpdate(
    { slug },
    {
      name: node.name,
      slug,
      level,
      parent_id: parentId,
      path: [...path, node.name],
      isLeaf: !node.children?.length,
      status: "Active",
      sortOrder: 0,
    },
    { upsert: true, new: true }
  );

  if (!node.children?.length && node.fields?.length) {
    await AttributeRule.findOneAndUpdate(
      { category_slug: slug },
      {
        category_id: category._id.toString(),
        category_slug: slug,
        fields: node.fields.map((field: any, index: number) => ({
          ...field,
          sortOrder: index + 1,
        })),
        status: "Active",
      },
      { upsert: true, new: true }
    );
  }

  if (node.children?.length) {
    for (const child of node.children) {
      await createNode({
        node: child,
        parentId: category._id.toString(),
        level: level + 1,
        path: [...path, node.name],
      });
    }
  }
}

export async function GET() {
  try {
    await connectDB();

    for (const root of categoryTree) {
      await createNode({ node: root });
    }

    return NextResponse.json({
      success: true,
      message: "Categories and attribute rules seeded successfully",
    });
  } catch (error: any) {
    console.error("Seed categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Seed failed",
      },
      { status: 500 }
    );
  }
}