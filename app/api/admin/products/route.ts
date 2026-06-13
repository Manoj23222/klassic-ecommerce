import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("Admin products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const {
      seller_id,
      seller_store_name,
      name,
      short_description,
      description,
      brand,
      tags,
      price,
      sale_price,
      stock,
      image,
      category,
      sub_category,
      gallery_images,
      colors,
      sizes,
      sku,
      status,
    } = await request.json();

    if (!name || !price || !image || !sku) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, price, image and SKU are required",
        },
        { status: 400 }
      );
    }

    const cleanSku = String(sku).trim().toUpperCase();

    const oldSku = await Product.findOne({ sku: cleanSku });

    if (oldSku) {
      return NextResponse.json(
        {
          success: false,
          message: "SKU already exists",
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      seller_id: seller_id || "admin",
      seller_store_name: seller_store_name || "Klassic Admin",

      name: String(name).trim(),
      short_description: short_description || "",
      description: description || "",
      brand: brand || "",
      tags: tags || "",

      price: Number(price),
      sale_price: Number(sale_price || 0),
      stock: Number(stock || 0),

      image,
      category: category || "General",
      sub_category: sub_category || "",
      gallery_images: Array.isArray(gallery_images) ? gallery_images : [],

      colors: colors || "",
      sizes: sizes || "",
      sku: cleanSku,

      status: status || "Approved",
      reject_reason: "",
      featured: false,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    console.error("Admin product create error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}