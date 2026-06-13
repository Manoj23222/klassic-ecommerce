import { NextResponse } from "next/server";
import mongoose from "mongoose";
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
      sub_category,
      short_description,
      description,
      brand,
      tags,
      price,
      sale_price,
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

    const cleanSku = String(sku).trim().toUpperCase();

    const oldSku = await Product.findOne({ sku: cleanSku });

    if (oldSku) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      seller_id,
      seller_store_name: seller_store_name || "",
      name: String(name).trim(),
      category: category || "General",
      sub_category: sub_category || "",
      short_description: short_description || "",
      description: description || "",
      brand: brand || "",
      tags: tags || "",
      price: Number(price),
      sale_price: Number(sale_price || 0),
      stock: Number(stock || 0),
      image,
      gallery_images: Array.isArray(gallery_images) ? gallery_images : [],
      colors: colors || "",
      sizes: sizes || "",
      sku: cleanSku,
      status: "Pending Approval",
      reject_reason: "",
      featured: false,
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
    const status = searchParams.get("status");
    const stock = searchParams.get("stock");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    const query: any = {
      seller_id: sellerId,
    };

    if (status) {
      query.status = status;
    }

    if (stock === "out") {
      query.stock = { $lte: 0 };
    }

    if (stock === "low") {
      query.stock = { $gt: 0, $lte: 5 };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

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

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      product_id,
      seller_id,
      name,
      category,
      sub_category,
      short_description,
      description,
      brand,
      tags,
      price,
      sale_price,
      stock,
      image,
      gallery_images,
      colors,
      sizes,
      sku,
    } = body;

    if (
      !product_id ||
      !seller_id ||
      !mongoose.Types.ObjectId.isValid(product_id)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product: any = await Product.findOne({
      _id: product_id,
      seller_id,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    if (sku) {
      const cleanSku = String(sku).trim().toUpperCase();

      const oldSku = await Product.findOne({
        sku: cleanSku,
        _id: { $ne: product_id },
      });

      if (oldSku) {
        return NextResponse.json(
          { success: false, message: "SKU already exists" },
          { status: 400 }
        );
      }

      product.sku = cleanSku;
    }

    product.name = name ?? product.name;
    product.category = category ?? product.category;
    product.sub_category = sub_category ?? product.sub_category;
    product.short_description = short_description ?? product.short_description;
    product.description = description ?? product.description;
    product.brand = brand ?? product.brand;
    product.tags = tags ?? product.tags;

    product.price = price !== undefined ? Number(price) : product.price;
    product.sale_price =
      sale_price !== undefined ? Number(sale_price || 0) : product.sale_price;

    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.image = image ?? product.image;

    product.gallery_images = Array.isArray(gallery_images)
      ? gallery_images
      : product.gallery_images;

    product.colors = colors ?? product.colors;
    product.sizes = sizes ?? product.sizes;

    product.status = "Pending Approval";
    product.reject_reason = "";

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated and sent for approval",
      product,
    });
  } catch (error: any) {
    console.error("Seller product update error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}