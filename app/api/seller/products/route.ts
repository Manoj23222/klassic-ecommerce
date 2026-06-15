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

function text(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null) return "";
  return String(value);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const name = body.name;
    const price = body.price || body.salePrice || body.regularPrice;
    const image = body.image;
    const stock = body.stock ?? 0;

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, message: "Name, price and image required" },
        { status: 400 }
      );
    }

    const sku = String(body.sku || `KL-${Date.now()}`)
      .trim()
      .toUpperCase();

    const oldSku = await Product.findOne({ sku });

    if (oldSku) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      seller_id: body.seller_id || "",
      seller_store_name: body.seller_store_name || "Klassic Seller",

      name: String(name).trim(),
      short_description: body.short_description || body.shortDescription || "",
      shortDescription: body.shortDescription || body.short_description || "",

      description: body.description || body.shortDescription || "",
      brand: body.brand || "",
      tags: text(body.tags),

      price: Number(price),
      sale_price: Number(body.sale_price || body.salePrice || 0),
      salePrice: Number(body.salePrice || body.sale_price || price),
      regularPrice: Number(body.regularPrice || price),
      costPrice: Number(body.costPrice || 0),
      gst: Number(body.gst || 0),

      stock: Number(stock),
      lowStock: Number(body.lowStock || 0),
      stockStatus: body.stockStatus || "In Stock",

      image,
      gallery_images: Array.isArray(body.gallery_images)
        ? body.gallery_images
        : [],

      videoUrl: body.videoUrl || "",

      category: body.category || "General",
      sub_category: body.sub_category || body.subcategory || "",
      subcategory: body.subcategory || body.sub_category || "",

      colors: text(body.colors),
      sizes: text(body.sizes),
      material: body.material || "",
      weight: body.weight || "",

      sku,
      status: body.status || "Pending Approval",

      featured: Boolean(body.featured),
      flashSale: Boolean(body.flashSale),
      discount: Number(body.discount || 0),

      seo: body.seo || {},
      features: arr(body.features),
      specifications: Array.isArray(body.specifications)
        ? body.specifications
        : [],

      shipping: body.shipping || {},
      returnPolicy: body.returnPolicy || {},

      reject_reason: "",
      approval_comment: "",
      admin_notes: "",
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

    const query: any = {};

    if (sellerId) query.seller_id = sellerId;
    if (status) query.status = status;

    if (stock === "out") query.stock = { $lte: 0 };
    if (stock === "low") query.stock = { $gt: 0, $lte: 5 };

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

    const productId = body.product_id;
    const sellerId = body.seller_id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const query: any = { _id: productId };
    if (sellerId) query.seller_id = sellerId;

    const product: any = await Product.findOne(query);

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
        _id: { $ne: productId },
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

    product.short_description =
      body.short_description ??
      body.shortDescription ??
      product.short_description;

    product.shortDescription =
      body.shortDescription ??
      body.short_description ??
      product.shortDescription;

    product.description = body.description ?? product.description;
    product.brand = body.brand ?? product.brand;

    product.tags =
      body.tags !== undefined ? text(body.tags) : product.tags;

    product.price =
      body.price !== undefined
        ? Number(body.price)
        : body.salePrice !== undefined
        ? Number(body.salePrice)
        : product.price;

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
      body.costPrice !== undefined
        ? Number(body.costPrice)
        : product.costPrice;

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

    product.colors =
      body.colors !== undefined ? text(body.colors) : product.colors;

    product.sizes =
      body.sizes !== undefined ? text(body.sizes) : product.sizes;

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
    console.error("Seller product update error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}