import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function text(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null) return "";
  return String(value);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      _id: id,
      seller_id: sellerId,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error("Seller product detail error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const {
      seller_id,
      name,
      category,
      sub_category,
      subcategory,
      description,
      short_description,
      shortDescription,
      price,
      sale_price,
      salePrice,
      regularPrice,
      stock,
      image,
      gallery_images,
      colors,
      sizes,
      sku,
      brand,
      tags,
      variants,
    } = body;

    if (!seller_id) {
      return NextResponse.json(
        { success: false, message: "Seller ID required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product: any = await Product.findOne({
      _id: id,
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
        _id: { $ne: id },
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
    product.sub_category = sub_category ?? subcategory ?? product.sub_category;
    product.description = description ?? product.description;
    product.short_description =
      short_description ?? shortDescription ?? product.short_description;

    product.price =
      price !== undefined
        ? Number(price)
        : salePrice !== undefined
        ? Number(salePrice)
        : product.price;

    product.sale_price =
      sale_price !== undefined
        ? Number(sale_price || 0)
        : salePrice !== undefined
        ? Number(salePrice || 0)
        : product.sale_price;

    product.regularPrice =
      regularPrice !== undefined ? Number(regularPrice || 0) : product.regularPrice;

    product.stock = stock !== undefined ? Number(stock || 0) : product.stock;

    product.image = image ?? product.image;

    product.gallery_images = Array.isArray(gallery_images)
      ? gallery_images
      : product.gallery_images;

    product.colors = text(colors ?? product.colors);
    product.sizes = text(sizes ?? product.sizes);
    product.brand = brand ?? product.brand;
    product.tags = text(tags ?? product.tags);

    if (Array.isArray(variants)) {
      product.variants = variants.map((v: any) => ({
        color: v.color || "",
        image: v.image || "",
        size: v.size || "",
        stock: String(v.stock || ""),
        price: String(v.price || ""),
        sku: String(v.sku || "").toUpperCase(),
      }));
    }

    product.status = "Pending Approval";
    product.reject_reason = "";

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated and sent for approval",
      product,
    });
  } catch (error: any) {
    console.error("Seller product update by id error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}