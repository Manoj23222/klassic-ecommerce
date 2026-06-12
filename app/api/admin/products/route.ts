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
      name,
      description,
      price,
      stock,
      image,
      category,
      gallery_images,
      colors,
      sizes,
      sku,
    } = await request.json();

    if (!name || !price || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, price and image are required",
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description: description || "",
      price: Number(price),
      stock: Number(stock || 0),
      image,
      category: category || "General",
      gallery_images: gallery_images || [],
      colors: colors || "",
      sizes: sizes || "",
      sku: sku || "",
      status: "Approved",
      featured: false,
      seller_id: "",
      seller_store_name: "Admin",
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