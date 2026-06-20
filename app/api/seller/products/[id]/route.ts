import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

function arr(value: any) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
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

    if (!body.seller_id) {
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
      seller_id: body.seller_id,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    if (body.sku) {
      const cleanSku = String(body.sku).trim().toUpperCase();

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

    product.name = body.name ?? product.name;
    product.category = body.category ?? product.category;
    product.sub_category =
      body.sub_category ?? body.subcategory ?? product.sub_category;
    product.subcategory =
      body.subcategory ?? body.sub_category ?? product.subcategory;

    product.description = body.description ?? product.description;
    product.short_description =
      body.short_description ??
      body.shortDescription ??
      product.short_description;
    product.shortDescription =
      body.shortDescription ??
      body.short_description ??
      product.shortDescription;

    product.price =
      body.price !== undefined ? Number(body.price || 0) : product.price;

    product.sale_price =
      body.sale_price !== undefined
        ? Number(body.sale_price || 0)
        : body.salePrice !== undefined
        ? Number(body.salePrice || 0)
        : product.sale_price;

    product.salePrice =
      body.salePrice !== undefined
        ? Number(body.salePrice || 0)
        : body.sale_price !== undefined
        ? Number(body.sale_price || 0)
        : product.salePrice;

    product.regularPrice =
      body.regularPrice !== undefined
        ? Number(body.regularPrice || 0)
        : product.regularPrice;

    product.stock =
      body.stock !== undefined ? Number(body.stock || 0) : product.stock;

    product.image = body.image ?? product.image;

    product.gallery_images =
      body.gallery_images !== undefined
        ? arr(body.gallery_images)
        : product.gallery_images;

    product.images =
      body.images !== undefined ? arr(body.images) : product.images;

    product.colors =
      body.colors !== undefined ? arr(body.colors) : product.colors;

    product.sizes =
      body.sizes !== undefined ? arr(body.sizes) : product.sizes;

    product.tags = body.tags !== undefined ? arr(body.tags) : product.tags;

    product.brand = body.brand ?? product.brand;

    product.quantityOptions =
      body.quantityOptions !== undefined
        ? arr(body.quantityOptions)
        : product.quantityOptions;

    product.quantities =
      body.quantities !== undefined ? arr(body.quantities) : product.quantities;

    product.weightOptions =
      body.weightOptions !== undefined
        ? arr(body.weightOptions)
        : product.weightOptions;

    if (Array.isArray(body.variants)) {
      product.variants = body.variants.map((v: any, index: number) => ({
        colorName: v.colorName || v.color || "",
        colorCode: v.colorCode || "#000000",
        color: v.color || v.colorName || "",
        size: v.size || "",
        material: v.material || "",
        sku: String(v.sku || `${product.sku || "KL"}-V${index + 1}`).toUpperCase(),
        stock: Number(v.stock || 0),
        price: Number(v.price || v.regularPrice || product.price || 0),
        sale_price: Number(v.sale_price || v.salePrice || 0),
        salePrice: Number(v.salePrice || v.sale_price || 0),
        regularPrice: Number(v.regularPrice || v.price || product.price || 0),
        image: v.image || (Array.isArray(v.images) ? v.images[0] : "") || "",
        images: arr(v.images),
        isDefault: Boolean(v.isDefault),
        status: v.status || "Active",
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