import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const products = await Product.find(filter).sort({
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

    const body = await request.json();

    const cleanSku = String(body.sku || "").trim().toUpperCase();

    if (!body.name || !body.price || !body.image || !cleanSku) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, price, image and SKU are required",
        },
        { status: 400 }
      );
    }

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
      seller_id: body.seller_id || "admin",
      seller_store_name: body.seller_store_name || "Klassic Admin",

      name: String(body.name).trim(),
      short_description: body.short_description || "",
      description: body.description || "",
      brand: body.brand || "",
      tags: body.tags || "",

      price: Number(body.price),
      sale_price: Number(body.sale_price || 0),
      stock: Number(body.stock || 0),

      image: body.image,
      gallery_images: Array.isArray(body.gallery_images)
        ? body.gallery_images
        : [],

      category: body.category || "General",
      sub_category: body.sub_category || "",

      colors: body.colors || "",
      sizes: body.sizes || "",
      sku: cleanSku,

      status: body.status || "Approved",
      reject_reason: "",
      approval_comment: "",
      admin_notes: "",
      featured: Boolean(body.featured || false),
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