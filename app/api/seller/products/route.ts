import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      seller_id,
      seller_store_name,
      name,
      category,
      description,
      price,
      stock,
      image,
      gallery_images,
      colors,
      sizes,
      sku,
    } = body;

    if (!seller_id || !name || !price || !image || !sku) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      seller_id,
      seller_store_name: seller_store_name || "",
      name,
      category: category || "General",
      description: description || "",
      price: Number(price),
      stock: Number(stock || 0),
      image,
      gallery_images: gallery_images || [],
      colors: colors || "",
      sizes: sizes || "",
      sku,
      status: "Pending Approval",
    });

    return NextResponse.json({
      success: true,
      message: "Product submitted for approval",
      product,
    });
  } catch (error: any) {
    console.error("Seller product add error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    const products = await Product.find({ seller_id: sellerId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("Seller products fetch error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}