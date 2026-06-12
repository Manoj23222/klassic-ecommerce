import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product: any = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const duplicatedProduct = await Product.create({
      seller_id: product.seller_id || "",
      seller_store_name: product.seller_store_name || "",
      name: `${product.name} Copy`,
      description: product.description || "",
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      image: product.image || "",
      gallery_images: product.gallery_images || [],
      category: product.category || "General",
      colors: product.colors || "",
      sizes: product.sizes || "",
      sku: product.sku ? `${product.sku}-COPY-${Date.now()}` : "",
      status: "Draft",
      featured: false,
    });

    return NextResponse.json({
      success: true,
      message: "Product duplicated successfully",
      product: duplicatedProduct,
    });
  } catch (error) {
    console.error("Duplicate product error:", error);

    return NextResponse.json(
      { success: false, message: "Duplicate product failed" },
      { status: 500 }
    );
  }
}