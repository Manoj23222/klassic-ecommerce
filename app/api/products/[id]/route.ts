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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const query: any = { _id: id };

    // Seller edit page ke liye seller_id optional support
    if (sellerId) {
      query.seller_id = sellerId;
    }

    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error("Product load error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Product load failed" },
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const query: any = { _id: id };

    if (body.seller_id) {
      query.seller_id = body.seller_id;
    }

    const product: any = await Product.findOne(query);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or access denied" },
        { status: 404 }
      );
    }

    product.name = body.name ?? product.name;
    product.description = body.description ?? product.description;
    product.short_description =
      body.short_description ?? body.shortDescription ?? product.short_description;
    product.shortDescription =
      body.shortDescription ?? body.short_description ?? product.shortDescription;

    product.price =
      body.price !== undefined ? Number(body.price) : product.price;

    product.regularPrice =
      body.regularPrice !== undefined
        ? Number(body.regularPrice)
        : product.regularPrice;

    product.salePrice =
      body.salePrice !== undefined
        ? Number(body.salePrice)
        : product.salePrice;

    product.sale_price =
      body.sale_price !== undefined
        ? Number(body.sale_price)
        : body.salePrice !== undefined
        ? Number(body.salePrice)
        : product.sale_price;

    product.costPrice =
      body.costPrice !== undefined ? Number(body.costPrice) : product.costPrice;

    product.gst =
      body.gst !== undefined ? Number(body.gst) : product.gst;

    product.stock =
      body.stock !== undefined ? Number(body.stock) : product.stock;

    product.lowStock =
      body.lowStock !== undefined ? Number(body.lowStock) : product.lowStock;

    product.stockStatus = body.stockStatus ?? product.stockStatus;

    product.image = body.image ?? product.image;

    product.gallery_images = Array.isArray(body.gallery_images)
      ? body.gallery_images
      : product.gallery_images;

    product.category = body.category ?? product.category;
    product.sub_category = body.sub_category ?? body.subcategory ?? product.sub_category;
    product.subcategory = body.subcategory ?? body.sub_category ?? product.subcategory;

    product.sku = body.sku ?? product.sku;
    product.brand = body.brand ?? product.brand;

    product.tags =
      body.tags !== undefined ? arr(body.tags) : product.tags;

    product.colors =
      body.colors !== undefined ? arr(body.colors) : product.colors;

    product.sizes =
      body.sizes !== undefined ? arr(body.sizes) : product.sizes;

    product.material = body.material ?? product.material;
    product.weight = body.weight ?? product.weight;
    product.videoUrl = body.videoUrl ?? product.videoUrl;

    product.seo = body.seo ?? product.seo;

    product.features =
      body.features !== undefined ? arr(body.features) : product.features;

    product.specifications = Array.isArray(body.specifications)
      ? body.specifications
      : product.specifications;

    product.shipping = body.shipping ?? product.shipping;
    product.returnPolicy = body.returnPolicy ?? product.returnPolicy;

    product.featured =
      body.featured !== undefined ? Boolean(body.featured) : product.featured;

    product.flashSale =
      body.flashSale !== undefined
        ? Boolean(body.flashSale)
        : product.flashSale;

    product.discount =
      body.discount !== undefined ? Number(body.discount) : product.discount;

    product.status = "Pending Approval";
    product.reject_reason = "";

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated and sent for approval",
      product,
    });
  } catch (error: any) {
    console.error("Product update error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Product update failed" },
      { status: 500 }
    );
  }
}