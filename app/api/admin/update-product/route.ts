import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

async function updateProduct(request: Request) {
  try {
    await connectDB();

    const {
      id,
      name,
      description,
      price,
      stock,
      image,
      category,
      featured,
      gallery_images,
      colors,
      sizes,
    } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const priceValue = Number(price);
    const stockValue = Number(stock);

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid price is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(stockValue) || stockValue < 0) {
      return NextResponse.json(
        { success: false, message: "Valid stock is required" },
        { status: 400 }
      );
    }

    const galleryImages = Array.isArray(gallery_images)
      ? gallery_images
      : String(gallery_images || "")
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean);

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        description: String(description || "").trim(),
        price: priceValue,
        stock: stockValue,
        image: String(image || "").trim(),
        category: category || "General",
        featured: Boolean(featured),
        gallery_images: galleryImages,
        colors: String(colors || ""),
        sizes: String(sizes || ""),
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return updateProduct(request);
}

export async function PATCH(request: Request) {
  return updateProduct(request);
}